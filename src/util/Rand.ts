export function randInt(low: number, high: number): number {
  low = Math.ceil(low);
  high = Math.ceil(high);
  return Math.floor(Math.random() * (high - low + 1)) + low;
}