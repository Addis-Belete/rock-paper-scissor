import { NextResponse } from "next/server";
import { DatabaseService } from "@/lib/services/databaseService";
import { RPGRepository } from "@/lib/repositories/rpgRepository";

export async function POST(req: Request) {
  try {
    await DatabaseService.connect();

    const body = await req.json();
    const { rpg } = body;

    if (!rpg) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const data = await RPGRepository.saveNewGame(rpg);
    return NextResponse.json(
      {
        message: "Rpg saved successfully",
        rpg: data,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("GET /api/v1/saveGame failed:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
