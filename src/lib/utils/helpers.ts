import { GameResult } from "@/types";

export function shortenAddress(addr: string, chars = 6) {
  return `${addr.slice(0, chars)}...${addr.slice(-chars)}`;
}

export function formatDate(timestamp: number | string) {
  const date = new Date(Number(timestamp));
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatRemainingTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const pad = (n: number) => n.toString().padStart(2, "0");

  if (hrs > 0) return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  if (mins > 0) return `${pad(mins)}:${pad(secs)}`;
  return `${secs}s`;
}

export const getGameStatus = (
  account: string,
  timeRemaining: string | number,
  progress: string,
  player1: string,
  status: string
) => {
  const role = account.toLowerCase() === player1 ? "player_one" : "player_two";

  if (status !== "active") return null;

  const time = Number(timeRemaining);

  if (isNaN(time)) return null;
  if (progress === "created" && role === "player_two") return "play";
  if (
    time === 0 &&
    ((progress === "created" && role === "player_one") ||
      (progress === "moved" && role === "player_two"))
  )
    return "refund";
  if (progress === "moved" && role === "player_one") return "solve";
  return null;
};

export const getWinStatus = (
  player1Move: string,
  player2Move: string | null
): Partial<GameResult> | null => {
  if (!player2Move) return null;
  if (Number(player1Move) > Number(player2Move)) return "win";

  if (Number(player1Move) > Number(player2Move)) return "loss";

  return "draw";
};

export const getPlayerGameResult = (
  role: "Player One" | "Player Two",
  result: GameResult
): GameResult => {
  if (role === "Player One") return result;
  switch (result) {
    case "win":
      return "loss";
    case "loss":
      return "win";
    case "timeout":
      return "refunded";
    case "refunded":
      return "timeout";
    default:
      return result;
  }
};
