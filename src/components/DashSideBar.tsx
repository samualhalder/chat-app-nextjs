"use client";

import { pusherClient } from "@/lib/pusher";
import { toPusherString } from "@/lib/utils";
import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import {
  HiArrowSmRight,
  HiChartPie,
  HiInbox,
  HiShoppingBag,
  HiTable,
  HiUser,
  HiViewBoards,
} from "react-icons/hi";
import { IoMdPersonAdd } from "react-icons/io";
import MessageToast from "./MessageToast";
import { RxDashboard } from "react-icons/rx";
export function DashSideBar({
  unseenFriendRequest,
  sessionId,
}: {
  unseenFriendRequest: number;
  sessionId: string;
}) {
  const [unSeenFriendRequestCount, setUnSeenFriendRequestCount] =
    useState<number>(unseenFriendRequest);

  useEffect(() => {
    pusherClient.subscribe(
      toPusherString(`user:${sessionId}:incoming_friend_request`)
    );
    const handleFriendRequest = () => {
      setUnSeenFriendRequestCount((pre) => pre + 1);
    };
    pusherClient.bind("incoming_friend_request", handleFriendRequest);
    return () => {
      pusherClient.unsubscribe(
        toPusherString(`user:${sessionId}:incoming_friend_request`)
      );
      pusherClient.unbind("incoming_friend_request", handleFriendRequest);
    };
  }, []);
  return (
    <Sidebar aria-label="Default sidebar example" className="w-full">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item href="/dashboard" icon={RxDashboard}>
            Dashboard
          </Sidebar.Item>
          <Sidebar.Item href="/dashboard/add" icon={IoMdPersonAdd}>
            Add friends
          </Sidebar.Item>
          <Sidebar.Item href="/dashboard/requests" icon={HiUser}>
            <div className="flex justify-between">
              <h1>Friend requests</h1>
              <span
                className="h-6 w-6 bg-purple-500 rounded-md text-center text-white "
                hidden={unSeenFriendRequestCount == 0}
              >
                {unSeenFriendRequestCount}
              </span>
            </div>
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
