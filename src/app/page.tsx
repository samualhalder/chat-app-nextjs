import { db } from "@/lib/db";
import { Alert, Button } from "flowbite-react";

export default async function Home() {
  return (
    <main>
      <h1 className="text-5xl">HEllo WOrld</h1>
      <Button>HEllo</Button>
      <Alert color={"failure"}>message</Alert>
    </main>
  );
}
