import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectItem } from "@/components/ui/select";
import { useState } from "react";
import { RPGService } from "@/lib/services/rpgService";
import { walletService } from "@/lib/services/walletService";
import { IRPG } from "@/types";
import { parseEther } from "ethers";
import { validateFrom } from "@/lib/utils/validation";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { ErrorHandler } from "@/lib/utils/errorHandler";
import { PayloadEncryptionService } from "@/lib/services/payloadEncryptionService";

export function PlayNewGame({
  account,
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
  account: string | null;
}) {
  const [formData, setFormData] = useState({
    move: "1",
    player2: "",
    salt: "",
    stakeAmount: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    player2?: string;
    salt?: string;
    stakeAmount?: string;
  }>({});
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined })); // clear error on change
  };

  const validate = () => {
    const newErrors = validateFrom(formData, account);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const playNewGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const rpgAddress = await RPGService.playNewRPGGame(
        walletService.getSigner(),
        formData.move,
        formData.salt,
        formData.stakeAmount,
        formData.player2
      );

      const lastAction = await RPGService.getRPGGameLastAction(
        walletService.getSigner(),
        rpgAddress as string
      );

      let signature =
        walletService.getSignature() ||
        sessionStorage.getItem("rpgGameSignature");

      if (!signature) {
        signature = await walletService.signMessage();
        sessionStorage.setItem("rpgGameSignature", signature);
      }

      const encryptedCommit = await PayloadEncryptionService.encryptPayload(
        { salt: formData.salt, move: formData.move },
        signature
      );

      const rpgData: IRPG = {
        rpgAddress: rpgAddress as string,
        player1Address: walletService.account?.toLowerCase() || "",
        player2Address: formData.player2.toLowerCase(),
        stakedETH: Number(parseEther(formData.stakeAmount)),
        createdAt: lastAction.toString(),
        lastAction: lastAction.toString(),
        status: "active",
        progress: "created",
        encryptedData: encryptedCommit,
        result: null,
        player2Move: null,
      };

      const res = await fetch("/api/v1/saveRpg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rpg: rpgData }),
      });

      const data = await res.json();

      if (res.ok) {
        onClose();
      } else {
        ErrorHandler.handleError(() => setIsError(true));
        setErrorMessage(data?.error || "Failed to save game.");
      }
    } catch (error) {
      console.error("playNewGame error:", error);
      ErrorHandler.handleError(() => setIsError(true));
      setErrorMessage("Game creation failed. Please retry your transaction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show}>
      <form className="flex flex-col gap-4 " onSubmit={(e) => playNewGame(e)}>
        <p className="text-lg font-semibold">Create New Game</p>
        <div className="w-full">
          <Label htmlFor="move">Select Move</Label>
          <Select
            name="move"
            value={formData.move}
            onChange={(e) => handleChange(e)}
          >
            <SelectItem value="1">Rock</SelectItem>
            <SelectItem value="2">Paper</SelectItem>
            <SelectItem value="3">Scissor</SelectItem>
            <SelectItem value="4">Spock</SelectItem>
            <SelectItem value="5">Lizard</SelectItem>
          </Select>
        </div>
        <div>
          <Label htmlFor="stakeAmount">Enter Stake Amount</Label>
          <Input
            placeholder="2 ETH"
            name="stakeAmount"
            onChange={(e) => handleChange(e)}
          />
          {errors.stakeAmount && (
            <p className="text-red-600">{errors.stakeAmount}</p>
          )}
        </div>

        <div>
          <Label htmlFor="salt">Enter Salt</Label>
          <Input
            name="salt"
            placeholder="Enter slat"
            onChange={(e) => handleChange(e)}
          />
          {errors.salt && <p className="text-red-600">{errors.salt}</p>}
        </div>
        <div>
          <Label htmlFor="player2">Enter Player 2 Address</Label>
          <Input
            placeholder="Enter player 2 address"
            name="player2"
            onChange={(e) => handleChange(e)}
          />
          {errors.player2 && <p className="text-red-600">{errors.player2}</p>}
        </div>

        <Button type="submit" className="mt-2" disabled={loading}>
          {loading ? "Playing New Game..." : "Play New Game"}
        </Button>

        {isError && (
          <Alert>
            <AlertDescription className="text-red-500">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        <Button variant="outline" onClick={onClose} disabled={loading}>
          Close
        </Button>
      </form>
    </Modal>
  );
}
