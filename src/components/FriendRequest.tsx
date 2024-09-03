"use client";
import { Button, HR } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { CiUser } from "react-icons/ci";
import { FcCancel } from "react-icons/fc";
import axios from "axios";
import { useRouter } from "next/navigation";
import { pusherClient } from "@/lib/pusher";
import { toPusherString } from "@/lib/utils";

export function FriendRequest({
  incomingFriendRequest,
  sessionId,
}: {
  incomingFriendRequest: IncomingFriendRequest[];
  sessionId: string;
}) {
  const router = useRouter();
  const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(
    incomingFriendRequest
  );

  const acceptFriend = async (friendId: string) => {
    const response = await axios.post("/api/friend/accept", { id: friendId });

    setFriendRequests((pre) =>
      pre.filter((sender) => sender.senderId !== friendId)
    );

    router.refresh();
  };

  const denyFriend = async (friendId: string) => {
    await axios.post("/api/friend/deny", { id: friendId });

    setFriendRequests((pre) =>
      pre.filter((sender) => sender.senderId !== friendId)
    );

    router.refresh();
  };

  useEffect(() => {
    pusherClient.subscribe(
      toPusherString(`user:${sessionId}:incoming_friend_request`)
    );
    const handleFriendRequest = ({
      senderId,
      senderEmail,
    }: IncomingFriendRequest) => {
      setFriendRequests((pre) => [...pre, { senderId, senderEmail }]);
    };
    pusherClient.bind("incoming_friend_request", handleFriendRequest);
    return () => {
      pusherClient.unsubscribe(
        toPusherString(`user:${sessionId}:incoming_friend_request`)
      );
      pusherClient.unbind("incoming_friend_request", handleFriendRequest);
    };
  }, [sessionId]);
  return (
    <>
      {friendRequests.length === 0 ? (
        <p>No requests to show</p>
      ) : (
        <div className="flex gap-4 text-lg">
          {friendRequests.map((request) => (
            <div key={request.senderId} className="flex gap-2 items-center">
              <CiUser />
              <p>{request.senderEmail}</p>
              <Button
                color="green"
                onClick={() => acceptFriend(request.senderId)}
              >
                <IoMdAdd />
              </Button>
              <Button color="red" onClick={() => denyFriend(request.senderId)}>
                <FcCancel />
              </Button>
              <HR color="black" />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
