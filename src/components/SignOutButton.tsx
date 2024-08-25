"use client";
import { Button, Spinner } from "flowbite-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { PiSignOutBold } from "react-icons/pi";

export function SignOutButton() {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();
  const handleSingOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      router.replace("/login");
    } catch (error) {
      console.log(error);
    }
    setIsSigningOut(true);
  };
  return (
    <>
      <Button disabled={isSigningOut} onClick={handleSingOut}>
        {isSigningOut ? <Spinner /> : <PiSignOutBold></PiSignOutBold>}
      </Button>
    </>
  );b
}
