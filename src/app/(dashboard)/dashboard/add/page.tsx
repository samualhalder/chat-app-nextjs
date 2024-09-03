import AddFriendButton from "@/components/AddFriendButton";
import React from "react";

export default async function Page(props) {
  return (
    <div className="pt-8">
      <h1 className="text-5xl font-bold ">Add Friends</h1>
      <AddFriendButton />
    </div>
  );
}
