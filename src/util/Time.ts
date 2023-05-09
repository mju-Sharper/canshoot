export const getTime = (): string => {
  const time = new Date();
  const enterTime = `${time.getHours()}:${time.getMinutes()}`;
  return enterTime;
};
