import { fetchRedis } from "./redis";

export const getAllFriendsById = async (userId: string) => {
  const friendsId = (await fetchRedis(
    "smembers",
    `user:${userId}:friends`
  )) as string[];
  const friends = Promise.all(
    friendsId.map(async (id) => (await fetchRedis("get", `user:${id}`)) as User)
  );
  return friends;
};
