export interface IRPG {
  player1Address: string;
  player2Address: string;
  stakedETH: string;
  timestamp: string;
  timeout: string;
  lastActionTimestamp: string;
  player1Move: string;
  player2Move: string | null;
  salt: number;
  status: "win" | "loss" | "cancelled" | "draw" | null;
  progress: "created" | "moved" | "solved" | null;
}
