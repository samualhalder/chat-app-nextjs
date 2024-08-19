const redisRESTUrl = process.env.UPSTASH_REDIS_REST_URL;
const redishToken = process.env.UPSTASH_REDIS_REST_TOKEN;

type command = "zrange" | "sismember" | "get" | "smembers";

export async function fetchRedis(
  command: command,
  ...args: (number | string)[]
) {
  const redisURL = `${redisRESTUrl}/${command}/${args.join("/")}`;

  const response = await fetch(redisURL, {
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Error in redis : ${response.statusText}`);
  }
  const data = await response.json();
  return data.result;
}
