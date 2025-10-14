"use client";
import { Gamepad2 } from "lucide-react";
import { Badge } from "./ui/badge";
import { walletService } from "@/lib/services/walletService";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { shortenAddress } from "@/lib/utils/helpers";
import { WalletContext } from "@/lib/utils/walletContext";

export function Header({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

  // reconnect
  useEffect(() => {
    (async () => {
      if (localStorage.getItem("rpgWalletConnected") === "true") {
        await connectWallet();
      }
    })();
  }, []);

  const connectWallet = async () => {
    try {
      await walletService.connect();
      const balance = await walletService.getBalance(walletService.account);
      localStorage.setItem("rpgWalletConnected", "true");
      await walletService.signMessage()
      setAccount(walletService.account || null);
      setBalance(balance);
    } catch (error) {
      console.error(error);
      throw new Error("falied to connect wallet");
    }
  };

  const disconnect = async () => {
    walletService.disconnect();
    localStorage.removeItem("rpgWalletConnected");
    setAccount(null);
    setBalance(null);
  };
  return (
    <WalletContext.Provider value={{ account, balance }}>
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                  <Gamepad2 className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-foreground text-red">
                    RPS Game
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Rock Paper Scissors Game
                  </p>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                {account && <Badge>{shortenAddress(account)}</Badge>}
                <Button
                  className="bg-primary/10 text-primary border-primary/20"
                  onClick={account ? disconnect : connectWallet}
                >
                  {account ? "Disconnect" : "Connect"}
                </Button>
              </div>
            </div>
          </div>
        </header>
        {children}
      </div>
    </WalletContext.Provider>
  );
}
