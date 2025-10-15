import { createContext } from "react";

/**
 * @notice React context for storing the connected wallet's account address and balance.
 * @dev Provides wallet information (account and balance) to components via context API.
 * @property account The connected wallet address, or null if not connected.
 * @property balance The wallet's ETH balance as a string, or null if not connected.
 */
export const WalletContext = createContext({ account: null, balance: null } as {
  account: string | null;
  balance: string | null;
});