"use client";

import { Message } from "@/lib/validators/messages";
import { format } from "date-fns";
import { cn, toPusherString } from "@/lib/utils";

import React, { useEffect, useRef, useState } from "react";
import { timeStamp } from "console";
import Image from "next/image";
import { pusherClient } from "@/lib/pusher";

export default function Message({
  initialMessages,
  sessionUserId,
  sessionImage,
  chatPartner,
  chatId,
}: {
  initialMessages: Message[];
  sessionUserId: string;
  sessionImage: string | undefined | null;
  chatPartner: User;
  chatId: string;
}) {
  const scrollDownRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const formatTimeStamp = (timestamp) => {
    return format(timestamp, "HH:mm");
  };
  useEffect(() => {
    pusherClient.subscribe(toPusherString(`chat:${chatId}`));
    const handleMessage = (message: Message) => {
      setMessages((pre) => [message, ...pre]);
    };
    pusherClient.bind("incoming-messages", handleMessage);
    return () => {
      pusherClient.unsubscribe(toPusherString(`chat:${chatId}`));
      pusherClient.unbind("incoming-messages", handleMessage);
    };
  }, []);
  return (
    <div className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto">
      <div ref={scrollDownRef} />
      {messages?.map((message, ind) => {
        const isCurrentUser = message.senderId === sessionUserId;
        const haveNextMessageFromSameUser =
          messages[ind - 1]?.senderId === messages[ind].senderId;

        return (
          <div key={`ind-${message.timestamp}`}>
            <div className={cn("flex ", { " justify-end": isCurrentUser })}>
              <div
                className={cn(
                  "felx flex-col max-w-xs mx-2 space-y-2 text-base",
                  {
                    "order-1 items-start": isCurrentUser,
                    "order-2 items-end": !isCurrentUser,
                  }
                )}
              >
                <span
                  className={cn("px-4 py-2 rounded-lg inline-block", {
                    "bg-indigo-600 text-white": isCurrentUser,
                    "bg-gray-300 text-black": !isCurrentUser,
                    " rounded-br-none":
                      !haveNextMessageFromSameUser && isCurrentUser,
                    "rounded-bl-none":
                      !haveNextMessageFromSameUser && !isCurrentUser,
                  })}
                >
                  {message.text}
                  {""}
                  <span className="text-xs text-gray-400 ml-3">
                    {formatTimeStamp(message.timestamp)}
                  </span>
                </span>
              </div>
              <div
                className={cn("relative w-10 h-10", {
                  "order-2": isCurrentUser,
                  "order-1": !isCurrentUser,
                  invisible: haveNextMessageFromSameUser,
                })}
              >
                <Image
                  fill
                  src={
                    isCurrentUser
                      ? (sessionImage as string)
                      : (chatPartner.image as string)
                  }
                  alt="image"
                  className="rounded-full"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
