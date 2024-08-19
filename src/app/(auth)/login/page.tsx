"use client";
import { Alert, Button, Spinner } from "flowbite-react";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";

function LogInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await signIn("google");
    } catch (error) {
      setErrorMessage(error);
    console.log(error);
    }
    setIsLoading(false);
  };
  return (
    <div className="h-screen flex flex-col justify-center items-center gap-10 ">
      <h1 className="text-5xl mb-20">Chat App</h1>
      <h1 className="text-5xl font-bold">Log in</h1>
      <Button
        size={"xl"}
        className="flex items-center justify-between"
        gradientDuoTone={"purpleToPink"}
        outline
        onClick={handleGoogleSignIn}
        disabled={isLoading}
      >
        {isLoading ? (
          <Spinner />
        ) : (
          <FcGoogle size={20} className="mx-4"></FcGoogle>
        )}
        <h1>Login with google</h1>
      </Button>
      {errorMessage && <Alert color={"failure"}>{errorMessage}</Alert>}
    </div>
  );
}

export default LogInPage;
