import { Model, Schema, model, models } from "mongoose";
import { IRPG } from "@/types";

const RPGSchema = new Schema({
  rpgAddress: { type: String, required: true },
  player1Address: { type: String, required: true },
  player2Address: { type: String, required: true },
  stakedETH: { type: Number, required: true },
  createdAt: { type: String, required: true },
  lastAction: { type: String, required: true },
  status: { enum: ["active", "completed"], type: String },
  result: {enum: ["win", "loss", "draw", "timeout", "refunded"], type: String },
  progress: {
    enum: ["created", "moved", "solved"],
    type: String,
    required: true,
  },
  encryptedData: {type: String, required: true},
  player2Move: {type: String }
});
RPGSchema.index({ player1Address: 1, playerAddress: 1 }); // index for faster queries by address and blockNumber

export const RPG: Model<IRPG> = models?.RPG || model("RPG", RPGSchema);
