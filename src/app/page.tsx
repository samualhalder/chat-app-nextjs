import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Alert, Button } from "flowbite-react";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main>
      <h1 className="text-5xl">HEllo WOrld:{JSON.stringify(session)}</h1>
      <Button>HEllo</Button>
      <Alert color={"failure"}>message</Alert>
    </main>
  );
}
