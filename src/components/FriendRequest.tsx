"use client";
import { Button, HR } from "flowbite-react";
import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { CiUser } from "react-icons/ci";
import { FcCancel } from "react-icons/fc";

export function FriendRequest({
  incomingFriendRequest,
}: {
  incomingFriendRequest: FriendRequest[];
}) {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>(
    incomingFriendRequest
  );
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
              <Button>
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
