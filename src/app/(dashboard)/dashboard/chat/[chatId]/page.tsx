import { fetchRedis } from "@/helper/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { messageArrayValidator } from "@/lib/validators/messages";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React from "react";

type ParamsType = {
  params: {
    chatId: string;
  };
};

const getMessages = async (chatId: string) => {
  try {
    const results: string[] = await fetchRedis(
      "zrange",
      `chat:${chatId}:messages`,
      0,
      -1
    );

    const dbMessages = results.map((message) => JSON.parse(message) as Message);
    const reverseDbmessages = dbMessages.reverse();
    const messages = messageArrayValidator.parse(reverseDbmessages);
    return messages;
  } catch (error) {
    return notFound();
  }
};

export default async function Page({ params }: ParamsType) {
  const { chatId } = params;
  const session = await getServerSession(authOptions);
  if (!session) {
    return notFound();
  }
  const userId = session.user.id;
  const [user1Id, user2Id] = chatId.split("--");
  if (userId !== user1Id && userId !== user2Id) {
    return notFound();
  }
  const chatPartnerId = userId === user1Id ? user2Id : user1Id;
  const chatPartner = (await db.get(`user:${chatPartnerId}`)) as User;
  const messages = getMessages(chatId);
  return (
    <>
      <div>{chatId}</div>
    </>
  );
}
