"use client";
import { Button, HR } from "flowbite-react";
import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { CiUser } from "react-icons/ci";
import { FcCancel } from "react-icons/fc";
import axios from "axios";
import { useRouter } from "next/navigation";

export function FriendRequest({
  incomingFriendRequest,
}: {
  incomingFriendRequest: FriendRequest[];
}) {
  const router = useRouter();
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>(
    incomingFriendRequest
  );

  const acceptFriend = async (friendId: string) => {
    console.log("hit fun");

    const response = await axios.post("/api/friend/accept", { id: friendId });
    console.log(response);

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
  return (
    <>
      {friendRequests.length === 0 ? (
        <p>No requests to show</p>
      ) : (
        <div className="flex gap-4 text-lg">
          {friendRequests.map((request) => (
            <div key={request.senderId} className="flex gap-2 items-center">
              <CiUser />
              <p>{request.email}</p>
              <Button
                color="green"
                onClick={() => acceptFriend(request.senderId)}
              >
                <IoMdAdd />
              </Button>
              <Button color="red">
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
