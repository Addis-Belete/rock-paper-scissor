import { Model, Schema, model, models } from "mongoose";
import { IRPG } from "@/types";

const RPGSchema = new Schema({
  player1Address: { type: String, required: true },
  player2Address: { type: String, required: true },
  stakedETH: { type: Number, required: true },
  timestamp: { type: String, required: true },
  timeout: { type: String, required: true },
  lastActionTimestamp: { type: String, required: true },
  player1Move: { type: String, required: true }, // TODO refactore
  player2Move: { type: String },
  salt: { type: Number, required: true }, // TODO: need to encrypted
  status: { enum: ["win", "loss", "cancelled", "draw"], type: String },
  progress: { enum: ["created", "moved", "solved"], type: String },
});
RPGSchema.index({ player1Address: 1, playerAddress: 1 }); // index for faster queries by address and blockNumber

export const RPG: Model<IRPG> = models?.RPG || model("RPG", RPGSchema);
