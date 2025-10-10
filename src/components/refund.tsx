import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { RPGService } from "@/lib/services/rpgService";
import { walletService } from "@/lib/services/walletService";
import { IRPG } from "@/types";
import { formatEther } from "ethers";

export function Refund({
  show,
  onClose,
  rpgData,
  balance,
  account,
}: {
  show: boolean;
  onClose: () => void;
  rpgData: IRPG;
  balance: string;
  account: string | null;
}) {
  const [loading, setLoading] = useState(false);

  const playerOneRefund = async (rpgData: IRPG) => {
    setLoading(true);
    try {
      await RPGService.callJ2TimeOut(
        rpgData.rpgAddress,
        walletService.getSigner()
      );

      const _rpgData: IRPG = {
        ...rpgData,
        status: "completed"
      };
      const res = await fetch("/api/v1/updateRpg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rpg: _rpgData }),
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const playerTwoRefund = async (rpgData: IRPG) => {
    setLoading(true);
    try {
      await RPGService.callJ2TimeOut(
        rpgData.rpgAddress,
        walletService.getSigner()
      );

      const _rpgData: IRPG = {
        ...rpgData,
        status: "completed"
      };
       await fetch("/api/v1/updateRpg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rpg: _rpgData }),
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show}>
      <div className="flex flex-col gap-4">
        <p className="text-lg font-semibold">Refund</p>
        <p>Your Current Balance: {formatEther(balance)} ETH</p>

        <Button
          type="button"
          className="mt-2"
          disabled={loading || Number(rpgData.stakedETH) > Number(balance)}
          onClick={() =>
            account?.toLowerCase() === rpgData.player1Address
              ? playerOneRefund(rpgData)
              : playerTwoRefund(rpgData)
          }
        >
          {loading ? "Submitting..." : "Submit"}
        </Button>

        <Button variant="outline" onClick={onClose} disabled={loading}>
          Close
        </Button>
      </div>
    </Modal>
  );
}
