import { fetchRedis } from "@/helper/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id: idToAdd } = z.object({ id: z.string() }).parse(body);

    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("You are not logged in.", { status: 400 });
    }
    const isFriend = await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idToAdd
    );
    if (isFriend) {
      return new Response("you are alredy a friend with this user.", {
        status: 400,
      });
    }
    const isInFriendRequestList = await fetchRedis(
      "sismember",
      `user:${session.user.id}:incoming_friend_request`,
      idToAdd
    );

    if (!isInFriendRequestList) {
      return new Response("Something went wrong", { status: 400 });
    }
    await db.sadd(`user:${session.user.id}:friends`, idToAdd);
    await db.sadd(`user:${idToAdd}:friends`, session.user.id);

    await db.srem(`user:${session.user.id}:incoming_friend_request`, idToAdd);

    return new Response("friend added succesfully.", { status: 200 });
  } catch (error) {
    return new Response("Something went wrong", { status: 400 });
  }
}
