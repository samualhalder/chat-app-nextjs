"use client";

import { addFriendValidator } from "@/lib/validators/addFriend-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Alert, Button, Label, TextInput } from "flowbite-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { HiMail } from "react-icons/hi";
import { z } from "zod";

type FormType = z.infer<typeof addFriendValidator>;
export default function AddFriendButton() {
  const [successStauts, setsuccessStauts] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(addFriendValidator),
  });

  const handleAddFriend = async (email: string) => {
    try {
      const validatedEmail = addFriendValidator.parse({ email });
      const response = await axios.post("/api/friend/add", {
        email: validatedEmail,
      });
      console.log(response);

      setsuccessStauts(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError("email", { message: error.message });
        return;
      }
      if (error instanceof axios.AxiosError) {
        setError("email", { message: error.response?.data });
        return;
      }
      setError("email", { message: "something went wrong." });
    }
  };

  const onSubmit = (e: FormType) => {
    handleAddFriend(e.email);
  };
  return (
    <>
      <form className="max-w-md" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-2 block">
          <Label htmlFor="email4" value="Your friends email" />
        </div>
        <div className="flex gap-2">
          <TextInput
            id="email4"
            type="email"
            {...register("email")}
            icon={HiMail}
            placeholder="name@mail.com"
            required
          />
          <Button type="submit">Add</Button>
        </div>
        {errors && errors.email?.message?.length && (
          <Alert color="failure" className="mt-2">
            {errors.email?.message}
          </Alert>
        )}
        {successStauts && (
          <Alert color={"success"} className="mt-2">
            Friend request send succesfully
          </Alert>
        )}
      </form>
    </>
  );
}
