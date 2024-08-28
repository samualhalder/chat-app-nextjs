export const chatHrefGenerator = (idone: string, idtwo: string) => {
  const sortedIds = [idone, idtwo].sort();
  return `/dashboard/chat/${sortedIds[0]}--${sortedIds[1]}`;
};
