import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectItem } from "@/components/ui/select";
import { useState } from "react";
import { RPGService } from "@/lib/services/rpgService";
import { walletService } from "@/lib/services/walletService";
import { DatabaseService } from "@/lib/services/databaseService";
import { IRPG } from "@/types";
import { parseEther } from "ethers";
import { RPGRepository } from "@/lib/repositories/rpgRepository";

export function PlayNewGame({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    move: "",
    player2: "",
    salt: "",
    stakeAmount: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const playNewGame = async (e: React.FormEvent) => {
    e.preventDefault();
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
      console.log(lastAction, "last");
      console.log(rpgAddress, "rpg");
      const player1 = '0x7Bc71F32E6Abb6bE619B5e31565fef0006a8e31d'
      const rpgData: IRPG = {
        rpgAddress: rpgAddress as string,
        player1Address: player1.toLowerCase(),
        player2Address: formData.player2.toLowerCase(),
        stakedETH: parseEther(formData.stakeAmount).toString(), // save in wei
        createdAt: lastAction.toString(),
        lastAction: lastAction.toString(),
        status: null,
        progress: "created",
      };

    const data =  await RPGRepository.saveNewGame(rpgData);
    console.log(data)
    } catch (error) {
      console.log(error);
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
        </div>

        <div>
          <Label htmlFor="salt">Enter Salt</Label>
          <Input
            name="salt"
            placeholder="Enter slat"
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div>
          <Label htmlFor="player2">Enter Player 2 Address</Label>
          <Input
            placeholder="Enter player 2 address"
            name="player2"
            onChange={(e) => handleChange(e)}
          />
        </div>

        <Button type="submit" className="mt-2" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </Button>

        <Button variant="outline" onClick={onClose} disabled={loading}>
          Close
        </Button>
      </form>
    </Modal>
  );
}
