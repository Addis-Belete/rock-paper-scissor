"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { PlayNewGame } from "@/components/newGameForm";
import { IRPG } from "@/types";
import { useContext } from "react";
import { WalletContext } from "@/lib/utils/walletContext";
import {
  formatDate,
  formatRemainingTime,
  shortenAddress,
} from "@/lib/utils/helpers";
import { formatEther } from "ethers";
import { getGameStatus } from "@/lib/utils/helpers";
import { Play } from "@/components/play";
import { Solve } from "@/components/solve";
import { Refund } from "@/components/refund";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [games, setGames] = useState<IRPG[]>([]);
  const [now, setNow] = useState(Date.now());
  const [modal, setModal] = useState({
    type: null,
    game: null,
    display: false,
  } as { type: "play" | "solve" | "refund" | null; game: IRPG | null; display: boolean });
  const [loading, setLoading] = useState(false);

  let { account, balance } = useContext(WalletContext);

  const fetchGames = async (): Promise<void> => {
    if (!account) return;

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const url = `${baseUrl}/api/v1/getRpgGames?address=${account}`;

      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch games: ${res.status}`);
      }

      const data = await res.json();
      setGames(data?.games);
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  useEffect(() => {
    const eventSource = new EventSource("/api/v1/stream");

    eventSource.onmessage = (event) => {
      const change = JSON.parse(event.data);
      console.log("Change received:", change);
      fetchGames()
    };

    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
      eventSource.close();
    };

    return () => eventSource.close();
  }, []);

  useEffect(() => {
    if (!account) return;
    (async () => {
      await fetchGames();
      
    })();
  }, [account]);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getRemaining = (endTime: number) => {
    return Math.max(0, Math.floor((endTime * 1000 - now) / 1000));
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] w-full justify-items-center min-h-screen pb-20 gap-16 sm:p-20">
      <main className="w-full flex flex-col gap-4">
        <div className="flex flex justify-between items-center">
          <ul className="flex gap-4 items-center">
            <li>
              <Button variant="outline">Active</Button>
            </li>
            <li>
              <Button variant="outline">Completed</Button>
            </li>
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
                refetch={fetchGames}
              />
            )}
          </div>
        </div>
        <div className="flex gap-4 flex-col">
          <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900 shadow-lg">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-300">
                    No.
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-300">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-300">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-300">
                    Address
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-300">
                    Staked ETH
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-300">
                    Status
                  </th>

                  <th className="px-4 py-3 text-left font-semibold text-gray-300">
                    Remaining Time
                  </th>

                  <th className="px-4 py-3 text-left font-semibold text-gray-300">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {account && games && games.length > 0 ? (
                  games.map((game, index) => {
                    const remaining = getRemaining(
                      Number(game.lastAction) + 5 * 60
                    );
                    const status = getGameStatus(
                      account,
                      remaining,
                      game.progress,
                      game.player1Address,
                      game.status as string
                    );
                    const role =
                      game.player1Address === account?.toLowerCase()
                        ? "Player One"
                        : "Player Two";
                    return (
                      <tr
                        className="hover:bg-gray-800/60 transition"
                        key={index}
                      >
                        <td className="px-6 py-4 text-sm text-blue-400 max-w-[150px]">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-100">
                          {formatDate(Number(game.createdAt) * 1000)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-100">
                          {role}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-100">
                          {game.player1Address === account?.toLowerCase()
                            ? shortenAddress(game.player2Address)
                            : shortenAddress(game.player1Address)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-100">
                          {formatEther(game.stakedETH)} ETH
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-100">
                          {game.status?.toUpperCase()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-100">
                          {formatRemainingTime(remaining)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-100">
                          {status ? (
                            <Button
                              variant="outline"
                              onClick={() =>
                                setModal({
                                  display: true,
                                  game,
                                  type: status,
                                })
                              }
                            >
                              {status}
                            </Button>
                          ) : (
                            "--"
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center p-4 text-gray-100">
                      {account
                        ? "No Data Available"
                        : "Please connect your wallet!"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
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
