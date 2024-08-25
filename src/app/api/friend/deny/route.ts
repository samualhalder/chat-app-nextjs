import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("unorthorize", { status: 401 });
    }
    const body = await req.json();
    const { id: idToDenay } = z.object({ id: z.string() }).parse(body);

    await db.srem(`user:${session.user.id}:incoming_friend_request`, idToDenay);
    return new Response("User remover succesfully.", { status: 200 });
  } catch (error) {
    return new Response("something went wrong", { status: 400 });
  }
}
