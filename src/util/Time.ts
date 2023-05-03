export const getTime = (): string => {
  const time = new Date();
  const enterTime = `${time.getTime()}:${time.getMinutes()}`;
  return enterTime;
};
