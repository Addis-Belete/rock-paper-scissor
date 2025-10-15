import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { RPGService } from "@/lib/services/rpgService";
import { walletService } from "@/lib/services/walletService";
import { GameResult, IRPG } from "@/types";
import { ErrorHandler } from "@/lib/utils/errorHandler";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { PayloadEncryptionService } from "@/lib/services/payloadEncryptionService";
import { getWinStatus } from "@/lib/utils/helpers";
import { formatEther } from "ethers";

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
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const solveGame = async () => {
    setLoading(true);
    let signature = walletService.getSignature();

    if (!signature) {
      signature = await walletService.signMessage();
    }
    const payload = await PayloadEncryptionService.decryptPayload(
      rpgData.encryptedData,
      signature
    );

    try {
      const tx = await RPGService.solve(
        rpgData.rpgAddress,
        walletService.getSigner(),
        payload.move,
        payload.salt
      );
      await tx.wait();
      const lastAction = await RPGService.getRPGGameLastAction(
        walletService.getSigner(),
        rpgData.rpgAddress
      );

      const gameResult = getWinStatus(Number(payload.move), Number(rpgData.player2Move));
      const _rpgData: IRPG = {
        ...rpgData,
        progress: "solved",
        status: "completed",
        lastAction: lastAction.toString(),
        result: gameResult as GameResult,
      };

      const res = await fetch("/api/v1/updateRpg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rpg: _rpgData }),
      });

      const data = await res.json();
      if (res.ok) {
        onClose();
      } else {
        ErrorHandler.handleError(() => setIsError(true));
        setErrorMessage(data?.error);
      }
    } catch (error) {
      ErrorHandler.handleError(() => setIsError(true));
      setErrorMessage(
        "Transaction failed!. move and salt must match the original."
      );
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show}>
      <div className="flex flex-col gap-4">
        <p className="text-lg font-semibold">Solve Game</p>
        <p>Your Current Balance: {formatEther(balance)} ETH</p>

        <Button
          type="button"
          className="mt-2"
          onClick={() => solveGame()}
          disabled={loading}
        >
          {loading ? "Solving..." : "Solve"}
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
      </div>
    </Modal>
  );
}
