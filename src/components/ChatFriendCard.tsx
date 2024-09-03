import { chatHrefGenerator } from "@/helper/chatHrefGenerator";
import Image from "next/image";
import React from "react";

export default function ChatFriendCard({
  sessionUserId,
  friend,
}: {
  sessionUserId: string;
  friend: User;
}) {
  return (
    <>
      <a
        href={`${chatHrefGenerator(sessionUserId, friend.id)}`} //its /dashboard/chat/userid1--userid2
        className="flex items-center gap-1"
      >
        <div className="h-10 w-10 rounded-full overflow-hidden relative">
          <Image fill src={friend.image} alt="img" />
        </div>
        <div>{friend.email}</div>
      </a>
    </>
  );
}
