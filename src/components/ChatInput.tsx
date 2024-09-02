"use client";
import { Alert, Button, Spinner, Toast } from "flowbite-react";
import React, { useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { LuSendHorizonal } from "react-icons/lu";
import { HiExclamation } from "react-icons/hi";
import axios from "axios";

export default function ChatInput({
  chatPartner,
  chatId,
}: {
  chatPartner: User;
  chatId: string;
}) {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [typedMessage, setTypedMessage] = useState<string>("");
  const [error, seterror] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const sendMessage = async () => {
    if (typedMessage === "") return;
    if (isLoading) return;
    setIsLoading(true);
    seterror(false);
    try {
      await axios.post(`/api/message/send`, { text: typedMessage, chatId });
      setTypedMessage("");

      textAreaRef.current?.focus();
    } catch (error) {
      console.log("errMess", error);

      seterror(true);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="border-t border-gray-300 p-4 mb-2 sm:mb-0">
      <div className="relative overflow-hidden  min-h-12 z-10 flex-1 rounded-lg  shadow-sm ring-1 ring-inset ring-gray-200 focus-within:ring-2 focus-within:ring-cyan-400">
        {error && (
          <Toast className="m-2">
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
              <HiExclamation className="h-5 w-5" />
            </div>
            <div className="ml-3 text-sm font-normal">Something went wrong</div>
            <Toast.Toggle />
          </Toast>
        )}
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
          onClick={sendMessage}
          className=" absolute right-0 bottom-0 m-1"
          size={"sm"}
        >
          {isLoading ? <Spinner size={"sm"} /> : <LuSendHorizonal />}
        </Button>
      </div>
    </div>
  );
}
