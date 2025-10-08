export interface IRPG {
  _id?: string;
  rpgAddress: string;
  player1Address: string;
  player2Address: string;
  stakedETH: string;
  createdAt: string;
  lastAction: string;
  status: "win" | "loss" | "cancelled" | "draw" | null;
  progress: "created" | "moved" | "solved"
}
