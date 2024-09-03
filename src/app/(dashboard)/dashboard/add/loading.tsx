import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Loading() {
  return (
    <div className="flex flex-col m-4">
      <Skeleton className="m-2" height={50} width={500} />
      <Skeleton className="" height={20} width={500} />
      <Skeleton className="" height={50} width={500} />
    </div>
  );
}
