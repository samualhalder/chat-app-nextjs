import ChatInput from "@/components/ChatInput";
import Message from "@/components/Message";
import { fetchRedis } from "@/helper/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { messageArrayValidator } from "@/lib/validators/messages";
import { getServerSession } from "next-auth";
import Image from "next/image";
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
    console.log(chatId);
    console.log("res", results);

    const dbMessages = results.map((message) => JSON.parse(message) as Message);
    console.log("db", dbMessages);

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
  const chatPartnerRaw = (await fetchRedis(
    "get",
    `user:${chatPartnerId}`
  )) as string;
  const chatPartner = JSON.parse(chatPartnerRaw) as User;
  const messages = await getMessages(chatId);
  return (
    <>
      <div className="flex flex-col justify-between  h-full flex-grow p-0 m-0">
        {/* top bar  */}
        <div className="flex items-center gap-4 border-1 shadow-lg w-full p-2">
          <div className="h-10 w-10 rounded-full overflow-hidden relative ">
            <Image
              fill
              //   referrerPolicy="norefference"
              src={chatPartner.image}
              alt="image"
            />
          </div>
          <div>
            <p className="text-xl font-semibold">{chatPartner.name}</p>
            <p className="text-gray-600">{chatPartner.email}</p>
          </div>
        </div>
        <Message
          sessionUserId={session.user.id}
          initialMessages={messages}
          sessionImage={session.user.image}
          chatPartner={chatPartner}
          chatId={chatId}
        />
        <ChatInput chatId={chatId} chatPartner={chatPartner} />
      </div>
    </>
  );
}
