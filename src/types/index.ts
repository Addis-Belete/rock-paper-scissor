export interface IRPG {
  _id?: string;
  rpgAddress: string;
  player1Address: string;
  player2Address: string;
  stakedETH: number;
  createdAt: string;
  lastAction: string;
  status: 'active' | "win" | "loss" | "cancelled" | "draw" | null;
  progress: "created" | "moved" | "solved"
}
