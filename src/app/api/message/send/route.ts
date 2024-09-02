import { fetchRedis } from "@/helper/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherString } from "@/lib/utils";
import { messageValidator } from "@/lib/validators/messages";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    const { text, chatId }: { text: string; chatId: string } = await req.json();
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unorthorze", { status: 401 });
    }
    const [chatId1, chatId2] = chatId.split("--");
    const friendId = session.user.id === chatId1 ? chatId2 : chatId1;
    const friendsOfUser = (await fetchRedis(
      "smembers",
      `user:${session.user.id}:friends`
    )) as string[];
    const isFriend = friendsOfUser.includes(friendId);
    if (!isFriend) {
      return new Response("Unorthorze", { status: 401 });
    }
    const senderString = (await fetchRedis(
      "get",
      `user:${session.user}`
    )) as string;
    const sender = JSON.parse(senderString) as User;
    const timestamp = Date.now();

    const messageObject: Message = {
      id: nanoid(),
      senderId: session.user.id,
      text,
      timestamp,
    };
    const message = messageValidator.parse(messageObject);
    pusherServer.trigger(
      toPusherString(`chat:${chatId}`),
      "incoming-messages",
      message
    );
    await db.zadd(`chat:${chatId}:messages`, {
      score: timestamp,
      member: JSON.stringify(message),
    });
    return new Response("OK", { status: 200 });
  } catch (error) {
    return new Response("server error", { status: 401 });
  }
}
