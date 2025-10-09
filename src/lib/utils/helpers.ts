export function shortenAddress(addr: string, chars = 6) {
  return `${addr.slice(0, chars)}...${addr.slice(-chars)}`;
}

export function formatDate(timestamp: number | string) {
  const date = new Date(Number(timestamp));
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatRemainingTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  // Format with leading zeros if you want (e.g. 01:09:05)
  const pad = (n: number) => n.toString().padStart(2, "0");

  if (hrs > 0) return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  if (mins > 0) return `${pad(mins)}:${pad(secs)}`;
  return `${secs}s`;
}