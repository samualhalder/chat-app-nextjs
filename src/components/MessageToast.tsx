import { Toast } from "flowbite-react";
import React from "react";
import { ExtendedMessage } from "./SidebarChatList";
import Link from "next/link";
import { chatHrefGenerator } from "@/helper/chatHrefGenerator";

export default function MessageToast({
  message,
  sessionUserId,
}: {
  message: ExtendedMessage | undefined;
  sessionUserId: string;
}) {
  return (
    <>
      {message && (
        <Link href={chatHrefGenerator(sessionUserId, message.senderId)}>
          <Toast className="flex ">
            <div>
              <h1 className="truncate text-black">{message.senderName}</h1>
              <div className="text-sm font-normal truncate">{message.text}</div>
            </div>
            <div className="ml-auto flex items-center space-x-2">
              <Toast.Toggle />
            </div>
          </Toast>
        </Link>
      )}
    </>
  );
}
