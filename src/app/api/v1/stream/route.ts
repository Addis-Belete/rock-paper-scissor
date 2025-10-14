import { NextRequest } from "next/server";
import { DatabaseService } from "@/lib/services/databaseService";

export async function GET(req: NextRequest) {
  const conn = await DatabaseService.connect();
  const collection = conn.connection.collection("rpgs");

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const changeStream = collection.watch()

        // Keep connection alive
        const interval = setInterval(() => {
          controller.enqueue(`:\n\n`);
        }, 15000);

        changeStream.on("change", (change) => {
          controller.enqueue(`data: ${JSON.stringify(change)}\n\n`);
        });

        changeStream.on("error", (err) => {
          console.error("Change stream error:", err);
        });

        req.signal.addEventListener("abort", () => {
          clearInterval(interval);
          changeStream.close();
          controller.close();
        });
      } catch (err: any) {
        console.error("SSE initialization error:", err);
        controller.enqueue(`event: error\ndata: ${err.message}\n\n`);
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
