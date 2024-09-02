import { fetchRedis } from "@/helper/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherString } from "@/lib/utils";
import { addFriendValidator } from "@/lib/validators/addFriend-validator";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    const emailResponse = addFriendValidator.parse(email);
    const emailToAdd = emailResponse.email;
    console.log(emailToAdd);

    const userIdToAdd = await fetchRedis("get", `user:email:${emailToAdd}`);

    const session = await getServerSession(authOptions);
    // const user = JSON.stringify(session);
    if (!userIdToAdd) {
      return new Response("No such user.", { status: 401 });
    }
    if (!session) {
      return new Response("Unortorized.", { status: 401 });
    }
    if (session.user.id === userIdToAdd) {
      return new Response("you cant add your self as your frined.", {
        status: 401,
      });
    }

    //  already sent friend request or not------->
    const isAlreadyAdded = (await fetchRedis(
      "sismember",
      `user:${userIdToAdd}:incoming_friend_request`,
      session.user.id
    )) as 0 | 1;
    if (isAlreadyAdded) {
      return new Response("user alredy added ", { status: 400 });
    }
    // alredy a friend or not------->
    const isAlreadyFriends = (await fetchRedis(
      "sismember",
      `user:${userIdToAdd}:friends`,
      session.user.id
    )) as 0 | 1;
    if (isAlreadyFriends) {
      return new Response("user alredy added ", { status: 400 });
    }

    pusherServer.trigger(
      toPusherString(`user:${userIdToAdd}:incoming_friend_request`),
      "incoming_friend_request",
      {
        senderId: session.user.id,
        senderEmail: session.user.email,
      }
    );

    db.sadd(`user:${userIdToAdd}:incoming_friend_request`, session.user.id);
    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Enter a valid email", { status: 422 });
    } else {
      return new Response("Something went wrong", { status: 400 });
    }
  }
}
