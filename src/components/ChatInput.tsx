"use client";
import { Button, Spinner } from "flowbite-react";
import React, { useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { LuSendHorizonal } from "react-icons/lu";

export default function ChatInput({ chatPartner }: { chatPartner: User }) {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [typedMessage, setTypedMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const sendMessage = () => {};
  return (
    <div className="border-t border-gray-300 p-4 mb-2 sm:mb-0">
      <div className="relative overflow-hidden  min-h-12 z-10 flex-1 rounded-lg  shadow-sm ring-1 ring-inset ring-gray-200 focus-within:ring-2 focus-within:ring-cyan-400">
        <TextareaAutosize
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          ref={textAreaRef}
          rows={4}
          value={typedMessage}
          onChange={(e) => setTypedMessage(e.target.value)}
          className="block w-full overflow-y-scroll no-scrollbar resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm p-2"
          placeholder={`message ${chatPartner?.name.toLocaleLowerCase()}`}
          maxRows={10}
        />
        <Button
          disabled={isLoading}
          className=" absolute right-0 bottom-0 m-1"
          size={"sm"}
        >
          {isLoading ? <Spinner size={"sm"} /> : <LuSendHorizonal />}
        </Button>
      </div>
    </div>
  );
}
