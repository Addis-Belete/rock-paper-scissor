import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectItem } from "@/components/ui/select";
import { useState } from "react";
import { RPGService } from "@/lib/services/rpgService";
import { walletService } from "@/lib/services/walletService";
import { IRPG } from "@/types";
import { Input } from "@/components/ui/input";

export function Solve({
  show,
  onClose,
  rpgData,
  balance,
}: {
  show: boolean;
  onClose: () => void;
  rpgData: IRPG;
  balance: string;
}) {
  const [formData, setFormData] = useState({
    move: "1",
    salt: "",
  });
  const [loading, setLoading] = useState(false);

  const solveGame = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await RPGService.solve(
        rpgData.rpgAddress,
        walletService.getSigner(),
        formData.move,
        "12"
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

      await res.json();
    } catch (error) {
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
        </div>

        <Button
          type="submit"
          className="mt-2"
          disabled={loading || Number(rpgData.stakedETH) > Number(balance)}
        >
          {loading ? "Submitting..." : "Submit"}
        </Button>

        <Button variant="outline" onClick={onClose} disabled={loading}>
          Close
        </Button>
      </form>
    </Modal>
  );
}
