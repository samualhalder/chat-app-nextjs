import { DashSideBar } from "@/components/DashSideBar";
import SidebarChatList from "@/components/SidebarChatList";
import { SignOutButton } from "@/components/SignOutButton";
import { getAllFriendsById } from "@/helper/get-all-friends-by-id";
import { fetchRedis } from "@/helper/redis";
import { authOptions } from "@/lib/auth";
import { Sidebar, Toast } from "flowbite-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { notFound } from "next/navigation";
import React, { useState } from "react";
import { IoIosChatboxes } from "react-icons/io";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const userSession = await getServerSession(authOptions);

  const user = userSession?.user;
  if (!userSession) {
    return notFound();
  }
  const unseenFriendRequest = (
    (await fetchRedis(
      "smembers",
      `user:${userSession?.user?.id}:incoming_friend_request`
    )) as []
  ).length;

  const friends = (await getAllFriendsById(userSession?.user.id)) as User[];

  return (
    <div className="h-screen w-[100%] flex flex-col sm:flex-row grow-0 ">
      {/* SideBar */}
      <div className="flex flex-col justify-between w-full sm:w-[500px] border-2  border-r-cyan-600">
        <IoIosChatboxes size={60} className="mx-auto" />
        <nav className="text-gray-700 p-10">
          <SidebarChatList
            sessionUserId={userSession.user.id}
            friends={friends}
          />
        </nav>
        {/* dash side options */}
        <div>
          <DashSideBar
            unseenFriendRequest={unseenFriendRequest}
            sessionId={userSession.user.id}
          />
        </div>

        {/* User section */}
        <div className="border-t-2 h-20 flex justify-around items-center">
          <div className="flex gap-2">
            <div className=" relative h-10 w-10 rounded-full overflow-hidden bottom-0">
              <Image
                className="relative"
                fill
                src={user?.image || "/user-icon.jpg"}
                alt="image"
              ></Image>
            </div>
            <div>
              <p>{user?.name}</p>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
          <div>
            <SignOutButton />
          </div>
        </div>
      </div>
      {/* children */}
      <div className=" w-[100%]">{children}</div>
    </div>
  );
};

export default Layout;
