/**
 * @returns random number between min and max inclusively
 */
export const randomBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
