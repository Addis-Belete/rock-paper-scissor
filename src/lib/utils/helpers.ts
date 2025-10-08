export function shortenAddress(addr: string, chars = 6) {
  return `${addr.slice(0, chars)}...${addr.slice(-chars)}`;
}