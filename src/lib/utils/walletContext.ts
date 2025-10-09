import { createContext } from "react";

export const WalletContext = createContext({ account: null, balance: null } as {
  account: string | null;
  balance: string | null;
});