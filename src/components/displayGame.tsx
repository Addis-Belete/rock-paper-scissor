"use client";

import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IRPG } from "@/types";
import {
  formatDate,
  formatRemainingTime,
  getPlayerGameResult,
  shortenAddress,
} from "@/lib/utils/helpers";
import { formatEther } from "ethers";
import { getGameStatus } from "@/lib/utils/helpers";
import { useRouter } from "next/navigation";

export default function DisplayGames({
  setModal,
  account,
  tab,
}: {
  setModal: React.Dispatch<
    React.SetStateAction<{
      type: "play" | "solve" | "refund" | null;
      game: IRPG | null;
      display: boolean;
    }>
  >;
  account: string | null;
  tab: string;
}) {
  const router = useRouter();

  const [games, setGames] = useState<IRPG[]>([]);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const url = `?tab=${tab}`;
    router.push(url, { scroll: false });
  }, [tab, router]);

  const filteredGames = useMemo(
    () => games?.filter((g) => g.status === tab),
    [games, tab]
  );

  const fetchGames = useCallback(async (): Promise<void> => {
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
  }, [account]);

  useEffect(() => {
    if (!account) return;

    const eventSource = new EventSource("/api/v1/stream");

    eventSource.onopen = () => {
      console.log("Connected to SSE stream");
    };

    eventSource.onmessage = (event) => {
      try {
        const change = JSON.parse(event.data);
        setGames((prev) => {
          if (change.operationType === "insert") {
            if (
              change.fullDocument.player2Address === account.toLowerCase() ||
              change.fullDocument.player1Address === account.toLowerCase()
            ) {
              // avoid duplicates
              const exists = prev?.some(
                (g) => g._id === change.fullDocument._id
              );
              if (!exists) {
                return [...prev, change.fullDocument];
              }
            }
          } else if (
            change.operationType === "update" ||
            change.operationType === "replace"
          ) {
            return prev.map((g) =>
              g._id === change.documentKey._id
                ? { ...g, ...change.updateDescription?.updatedFields }
                : g
            );
          } else if (change.operationType === "delete") {
            return prev.filter((g) => g._id !== change.documentKey._id);
          }
          return prev;
        });
      } catch (err) {
        console.error("Failed to parse SSE event:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
    };

    return () => {
      console.log("Closing SSE connection");
      eventSource.close();
    };
  }, [account]); //only depends on account

  useEffect(() => {
    if (!account) return;
    (async () => {
      await fetchGames();
    })();
  }, [account, fetchGames]);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getRemaining = (endTime: number) => {
    return Math.max(0, Math.floor((endTime * 1000 - now) / 1000));
  };

  return (
    <div className="flex gap-4 flex-col">
      <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900 shadow-lg">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              {[
                "No.",
                "Date",
                "Role",
                "Opponent Address",
                "Staked ETH",
                "Status",
                "Result",
                "Remaining Time",
                "Action",
              ].map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left font-semibold text-gray-300"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {account && filteredGames && filteredGames.length > 0 ? (
              filteredGames.map((game, index) => {
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
                  <tr className="hover:bg-gray-800/60 transition" key={index}>
                    <td className="px-6 py-4 text-sm text-blue-400 max-w-[150px]">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-100">
                      {formatDate(Number(game.createdAt) * 1000)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-100">{role}</td>
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
                      {game?.result
                        ? getPlayerGameResult(role, game.result)?.toUpperCase()
                        : "--"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-100">
                      {game.status === "completed"
                        ? "--"
                        : formatRemainingTime(remaining)}
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
  );
}
