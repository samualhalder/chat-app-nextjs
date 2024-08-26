import React from "react";

export default function SidebarChatList({ friends }: { friends: User[] }) {
  return (
    <ul className="max-h-[125rem] overflow-y-hidden">
      {friends.sort().map((friend, ind) => {
        const friendDetails = JSON.parse(friend);

        return (
          <li key={ind} className=" flex gap-1 items-center">
            <div className="h-10 w-10 rounded-full overflow-hidden">
              <img src={friendDetails.image} alt="img" />
            </div>
            <div>{friendDetails.email}</div>
          </li>
        );
      })}
    </ul>
  );
}
