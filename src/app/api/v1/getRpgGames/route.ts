import { NextResponse } from "next/server";
import { DatabaseService } from "@/lib/services/databaseService";
import { RPGRepository } from "@/lib/repositories/rpgRepository";

export async function GET(req: Request) {
  try {
    await DatabaseService.connect();

    const { searchParams } = new URL(req.url);

    const address = searchParams.get("address")?.toLowerCase();

    if (!address) {
      return NextResponse.json(
        { error: "Missing required parameter: address" },
        { status: 400 }
      );
    }

    const data = await RPGRepository.getRPGGames(address.toLowerCase())
    console.log('data')
    return NextResponse.json({
      message: "fetched games successfully",
      games: data,
   
    });
  } catch (error) {
    console.error("GET /api/v1/getRpgGames failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch games" },
      { status: 500 }
    );
  }
}
