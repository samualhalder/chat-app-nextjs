"use client";
import { chatHrefGenerator } from "@/helper/chatHrefGenerator";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ChatFriendCard from "./ChatFriendCard";
import { pusherClient } from "@/lib/pusher";
import { toPusherString } from "@/lib/utils";
import MessageToast from "./MessageToast";

export interface ExtendedMessage extends Message {
  senderImg: string;
  senderName: string;
}

export default function SidebarChatList({
  friends,
  sessionUserId,
}: {
  friends: User[];
  sessionUserId: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);
  const [lastMessage, setLastMessage] = useState<ExtendedMessage>();

  useEffect(() => {
    pusherClient.subscribe(toPusherString(`user:${sessionUserId}:chats`));
    pusherClient.subscribe(toPusherString(`user:${sessionUserId}:friends`));

    const chatHandler = (message: ExtendedMessage) => {
      const isNotify =
        pathname !== `${chatHrefGenerator(sessionUserId, message?.senderId)}`;
      console.log(
        isNotify,
        chatHrefGenerator(sessionUserId, message?.senderId)
      );
      if (!isNotify) return;
      setLastMessage(message);
    };
    const friendHandler = () => {
      router.refresh();
    };
    pusherClient.bind("new_message", chatHandler);
    pusherClient.bind("new_friend", friendHandler);
    return () => {
      pusherClient.unsubscribe(toPusherString(`user:${sessionUserId}:chats`));
      pusherClient.unsubscribe(toPusherString(`user:${sessionUserId}:friends`));
    };
  }, [pathname]);

  useEffect(() => {
    if (pathname?.includes("chat")) {
      unseenMessages.filter((msg) => !pathname.includes(msg.senderId));
    }
  }, [pathname]);
  return (
    <div>
      <MessageToast message={lastMessage} sessionUserId={sessionUserId}/>
      <h1 className="text-lg font-semibold">chats</h1>
      <ul className="max-h-[125rem] overflow-y-hidden">
        {friends.sort().map((friend, ind) => {
          const noOfUnseenMessages = unseenMessages.filter(
            (msg) => msg.senderId === friend.id
          ).length;

          return (
            <li
              key={ind}
              className=" flex gap-1 items-center m-2 border-2 p-2 border-white shadow-md rounded-md hover:text-gray-400"
            >
              <ChatFriendCard sessionUserId={sessionUserId} friend={friend} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
