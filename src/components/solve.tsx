import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectItem } from "@/components/ui/select";
import { useState } from "react";
import { RPGService } from "@/lib/services/rpgService";
import { walletService } from "@/lib/services/walletService";
import { IRPG } from "@/types";
import { Input } from "@/components/ui/input";
import { validateSolveFrom } from "@/lib/utils/validation";
import { ErrorHandler } from "@/lib/utils/errorHandler";
import { Alert, AlertDescription } from "@/components/ui/Alert";

export function Solve({
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
  const [formData, setFormData] = useState({
    move: "1",
    salt: "",
  });
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<{
    salt?: string;
  }>({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const validate = () => {
    const newErrors = validateSolveFrom(formData.salt);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const solveGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await RPGService.solve(
        rpgData.rpgAddress,
        walletService.getSigner(),
        formData.move,
        formData.salt
      );

      const lastAction = await RPGService.getRPGGameLastAction(
        walletService.getSigner(),
        rpgData.rpgAddress
      );

      const _rpgData: IRPG = {
        ...rpgData,
        progress: "solved",
        status: "completed",
        lastAction: lastAction.toString(), // add completed status
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
      ErrorHandler.handleError(() => setIsError(true));
      setErrorMessage("Something went wrong. Please try again!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

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
  };

  return (
    <Modal show={show}>
      <form className="flex flex-col gap-4" onSubmit={(e) => solveGame(e)}>
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Solve Game</p>
        </div>
        <p className="text-yellow-500">
          {" "}
          Note: Please enter the move and salt you used when creating the game.
        </p>
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
          <Label htmlFor="salt">Enter Salt</Label>
          <Input
            name="salt"
            placeholder="Enter slat"
            onChange={(e) => handleChange(e)}
          />
          {errors.salt && <p className="text-red-600">{errors.salt}</p>}
        </div>

        <Button
          type="submit"
          className="mt-2"
          disabled={loading || Number(rpgData.stakedETH) > Number(balance)}
        >
          {loading ? "Submitting..." : "Submit"}
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
