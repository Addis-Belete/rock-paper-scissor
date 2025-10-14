export {};

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum?: any;
  }
  interface mongoose {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  }
}
