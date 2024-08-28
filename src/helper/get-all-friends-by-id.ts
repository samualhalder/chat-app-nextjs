import { fetchRedis } from "./redis";

export const getAllFriendsById = async (userId: string) => {
  const friendsId = (await fetchRedis(
    "smembers",
    `user:${userId}:friends`
  )) as string[];
  const friends = await Promise.all(
    friendsId.map(async (id) => {
      const friend = (await fetchRedis(`get`, `user:${id}`)) as string;
      const persedFriend = JSON.parse(friend) as User;
      return persedFriend;
    })
  );
  return friends;
};
