export {};

declare global {
  interface Window {
    ethereum?: any;
  }
  interface mongoose {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  }
}
