import { Wallet, Gamepad2 } from "lucide-react";
import { Badge } from "./ui/badge";

export function Header({children}: {children: React.ReactNode}) {
  return (
    <div className="min-h-screen bg-background">
    <header className="border-b border-border bg-card/50 backdrop-blur-sm mb-8">
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
          <Badge className="bg-primary/10 text-primary border-primary/20">
            Connect Wallet
          </Badge>
        </div>
      </div>
    </header>
    {children}
    </div>
  );
}
