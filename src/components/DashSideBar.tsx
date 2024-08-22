"use client";

import { Sidebar } from "flowbite-react";
import {
  HiArrowSmRight,
  HiChartPie,
  HiInbox,
  HiShoppingBag,
  HiTable,
  HiUser,
  HiViewBoards,
} from "react-icons/hi";

export function DashSideBar({
  unseenFriendRequest,
}: {
  unseenFriendRequest: number;
}) {
  return (
    <Sidebar aria-label="Default sidebar example" className="w-full">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item href="/dashboard" icon={HiChartPie}>
            Dashboard
          </Sidebar.Item>

          <Sidebar.Item
            href="/dashboard/requests"
            icon={HiUser}
            label={unseenFriendRequest.toString()}
          >
            Friend request
          </Sidebar.Item>
          <Sidebar.Item href="/dashboard/add" icon={HiUser}>
            Add friends
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiShoppingBag}>
            Products
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
