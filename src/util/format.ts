export function formatMilliseconds(time: number) {
  const num = time * 1000;
  return Number(num.toFixed(3));
}