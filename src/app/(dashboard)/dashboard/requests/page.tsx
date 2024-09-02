import { fetchRedis } from "@/helper/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

import { notFound } from "next/navigation";
import React from "react";
import { FriendRequest } from "@/components/FriendRequest";

export default async function Page(props) {
  const session = await getServerSession(authOptions);
  if (!session) return notFound();
  const requesredIds = (await fetchRedis(
    "smembers",
    `user:${session?.user?.id}:incoming_friend_request`
  )) as [] as string[];
  const requestedUsers = await Promise.all(
    requesredIds.map(async (id) => {
      const senderString = (await fetchRedis("get", `user:${id}`)) as string;
      const sender = JSON.parse(senderString) as User;
      return {
        senderId: id,
        senderEmail: sender.email,
      };
    })
  );
  console.log("ids", requesredIds);

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <h1 className="text-5xl font-bold mx-auto">Friend requests</h1>
      <div className="mt-10">
        <FriendRequest
          incomingFriendRequest={requestedUsers}
          sessionId={session.user.id}
        />
      </div>
    </div>
  );
}
