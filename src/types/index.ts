
export type GameResult = "win" | "loss" | "draw" | "timeout" | "refunded" | null;
export interface IRPG {
  _id?: string;
  rpgAddress: string;
  player1Address: string;
  player2Address: string;
  stakedETH: number;
  createdAt: string;
  lastAction: string;
  status: "active" | "completed" | null;
  progress: "created" | "moved" | "solved";
  result: GameResult
  encryptedData: string;
  player2Move: string | null
}

