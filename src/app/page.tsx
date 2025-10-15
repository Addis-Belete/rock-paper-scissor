"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { PlayNewGame } from "@/components/playNewGame";
import { IRPG } from "@/types";
import { useContext } from "react";
import { WalletContext } from "@/lib/utils/walletContext";
import { Play } from "@/components/play";
import { Solve } from "@/components/solve";
import { Refund } from "@/components/refund";
import { useSearchParams } from "next/navigation";
import DisplayGames from "@/components/displayGame";

export default function Home() {
  const searchParams = useSearchParams();

  const [showModal, setShowModal] = useState(false);
  const [modal, setModal] = useState({
    type: null,
    game: null,
    display: false,
  } as { type: "play" | "solve" | "refund" | null; game: IRPG | null; display: boolean });

  const [tab, setTab] = useState(searchParams.get("tab") || "active");

  const { account, balance } = useContext(WalletContext);

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] w-full justify-items-center min-h-screen pb-20 gap-16 sm:p-20">
      <main className="w-full flex flex-col gap-4">
        <div className="flex flex justify-between items-center">
          <ul className="flex gap-4 items-center">
            {["active", "completed"].map((t, index) => {
              return (
                <li key={index}>
                  <Button
                    variant="outline"
                    onClick={() => setTab(t)}
                    active={tab === t}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </Button>
                </li>
              );
            })}
          </ul>

          <div className="">
            <Button
              disabled={account === null}
              className="flex gap-2 items-center"
              onClick={() => setShowModal(true)}
            >
              <Plus />
              <span>Play New Game</span>
            </Button>

            {showModal && (
              <PlayNewGame
                account={account}
                show={showModal}
                onClose={() => setShowModal(false)}
              />
            )}
          </div>
        </div>
        <DisplayGames setModal={setModal} account={account} tab={tab} />
        {modal?.type === "solve" && modal?.game && (
          <Solve
            balance={balance || "0"}
            rpgData={modal?.game}
            show={modal.display}
            onClose={() => setModal({ display: false, game: null, type: null })}
          />
        )}

        {modal?.type === "play" && modal?.game && (
          <Play
            balance={balance || "0"}
            rpgData={modal?.game}
            show={modal.display}
            onClose={() => setModal({ display: false, game: null, type: null })}
          />
        )}
        {modal?.type === "refund" && modal?.game && (
          <Refund
            balance={balance || "0"}
            rpgData={modal?.game}
            show={modal.display}
            account={account}
            onClose={() => setModal({ display: false, game: null, type: null })}
          />
        )}
      </main>
    </div>
  );
}
