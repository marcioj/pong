export function clamp(n, min, max) {
  return Math.max(Math.min(n, max), min);
}

export const roundUpToNextMultiple = (numToRound, multiple) => {
  if (multiple == 0) return numToRound;

  const remainder = Math.abs(numToRound) % multiple;
  if (remainder == 0) return numToRound;

  if (numToRound < 0) return -(Math.abs(numToRound) - remainder);
  else return numToRound + multiple - remainder;
};

export function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
