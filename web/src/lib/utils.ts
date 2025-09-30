export function humanTime(date: Date): string {
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();

  let result = "";

  if (hours > 0) result += `${hours}:`;

  if (hours > 0) result += `${minutes.toString().padStart(2, "0")}:`;
  else result += `${minutes}:`;

  result += seconds.toString().padStart(2, "0");

  return result;
}

export function randomItem<T>(array: T[]): T | undefined {
  if (array.length === 0) return undefined;
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}
