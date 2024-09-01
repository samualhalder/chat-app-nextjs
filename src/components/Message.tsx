"use client";

import { Message } from "@/lib/validators/messages";
import { cn } from "@/lib/utils";

import React, { useRef, useState } from "react";

export default function Message({
  initialMessages,
  sessionUserId,
}: {
  initialMessages: Message[];
  sessionUserId: string;
}) {
  const scrollDownRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  console.log(initialMessages);

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
                    {message.timestamp}
                  </span>
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
