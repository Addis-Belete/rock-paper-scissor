import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { DatabaseService } from "@/lib/services/databaseService";

export const metadata: Metadata = {
  title: "RPS Game",
  description: "Rock Paper Scissors Game",
};

DatabaseService.connect();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="dark">
        <Header>{children}</Header>
      </body>
    </html>
  );
}
