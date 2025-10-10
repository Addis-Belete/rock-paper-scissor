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
}
