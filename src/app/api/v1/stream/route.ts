import { NextRequest } from "next/server";
import { DatabaseService } from "@/lib/services/databaseService";

export async function GET(req: NextRequest) {
  const conn = await DatabaseService.connect();
  const collection = conn.connection.collection("rpg");

  const stream = new ReadableStream({
    async start(controller) {
      const changeStream = collection.watch();
      console.log('here in stream')
      changeStream.on("change", (change) => {
        controller.enqueue(`data: ${JSON.stringify(change)}\n\n`);
      });

      changeStream.on("error", (err) => {
        controller.enqueue(`event: error\ndata: ${err.message}\n\n`);
        controller.close();
      });

      req.signal.addEventListener("abort", () => {
        changeStream.close();
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
