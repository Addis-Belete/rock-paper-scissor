import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectItem } from "@/components/ui/select";
import { useState } from "react";
import { RPGService } from "@/lib/services/rpgService";
import { walletService } from "@/lib/services/walletService";
import { IRPG } from "@/types";
import { formatEther } from "ethers";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { ErrorHandler } from "@/lib/utils/errorHandler";

export function Play({
  show,
  onClose,
  rpgData,
  balance,
  refetch,
}: {
  show: boolean;
  onClose: () => void;
  rpgData: IRPG;
  balance: string;
  refetch: () => Promise<void>;
}) {
  const [move, setMove] = useState("1");
  const [loading, setLoading] = useState(false);

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const playGame = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await RPGService.move(
        rpgData.rpgAddress,
        move,
        walletService.getSigner(),
        rpgData.stakedETH.toString()
      );

      const lastAction = await RPGService.getRPGGameLastAction(
        walletService.getSigner(),
        rpgData.rpgAddress
      );

      const _rpgData: IRPG = {
        ...rpgData,
        progress: "moved",
        lastAction: lastAction.toString(),
      };

      const res = await fetch("/api/v1/updateRpg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rpg: _rpgData }),
      });
      const data = await res.json();
      if (res.ok) {
        await refetch();
        onClose();
      } else {
        ErrorHandler.handleError(() => setIsError(true));
        setErrorMessage(data?.error);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show}>
      <form className="flex flex-col gap-4" onSubmit={(e) => playGame(e)}>
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Play Game</p>
          <p>Available Balance: {formatEther(balance)} ETH</p>
        </div>
        <p>Expected Stake Amount: {formatEther(rpgData.stakedETH)} ETH</p>
        <div className="w-full">
          <Label htmlFor="move">Select Move</Label>
          <Select
            name="move"
            value={move}
            onChange={(e) => setMove(e.target.value)}
          >
            <SelectItem value="1">Rock</SelectItem>
            <SelectItem value="2">Paper</SelectItem>
            <SelectItem value="3">Scissor</SelectItem>
            <SelectItem value="4">Spock</SelectItem>
            <SelectItem value="5">Lizard</SelectItem>
          </Select>
        </div>

        <Button
          type="submit"
          className="mt-2"
          disabled={loading || Number(rpgData.stakedETH) > Number(balance)}
        >
          {loading ? "Submitting..." : "Submit"}
        </Button>

        {Number(rpgData.stakedETH) > Number(balance) && (
          <Alert>
            <AlertDescription>
              Insufficient balance to play the game
            </AlertDescription>
          </Alert>
        )}

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
