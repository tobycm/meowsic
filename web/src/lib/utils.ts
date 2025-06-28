export function humanTime(date: Date): string {
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();

  let result = "";

  if (hours > 0) result += `${hours}:`;

  if (hours > 0 || minutes > 0) result += `${minutes.toString().padStart(2, "0")}:`;

  result += seconds.toString().padStart(2, "0");

  return result;
}
