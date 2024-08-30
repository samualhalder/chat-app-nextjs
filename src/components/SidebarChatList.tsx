"use client";
import { chatHrefGenerator } from "@/helper/chatHrefGenerator";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

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

  useEffect(() => {
    if (pathname?.includes("chat")) {
      unseenMessages.filter((msg) => !pathname.includes(msg.senderId));
    }
  }, [pathname]);
  return (
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
            <a
            href={`${chatHrefGenerator(sessionUserId, friend.id)}`}   //its /dashboard/chat/userid1--userid2
              className="flex items-center gap-1"
            >
              <div className="h-10 w-10 rounded-full overflow-hidden">
                <img src={friend.image} alt="img" />
              </div>
              <div>{friend.email}</div>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
