"use client";

import { useAccount, useBalance } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const USDM_ADDRESS = "0x765de816845861e75a25fca122bb6898b8b1282a";
const USDC_ADDRESS = "0xcebA9300f2b948710d2653dD7B07f33A8B32118C";
const USDT_ADDRESS = "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e";

function BalanceDisplay({
  address,
  token,
  symbol,
  muted,
}: {
  address: `0x${string}`;
  token: `0x${string}`;
  symbol: string;
  muted?: boolean;
}) {
  const { data, isLoading } = useBalance({ address, token });

  return (
    <div className="flex justify-between items-center">
      <span className={muted ? "text-muted-foreground/60" : "text-muted-foreground"}>
        {symbol}
      </span>
      <span className={muted ? "font-medium text-muted-foreground/60" : "font-medium"}>
        {isLoading ? "…" : parseFloat(data?.formatted || "0").toFixed(4)}
      </span>
    </div>
  );
}

function truncate(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function UserBalance() {
  const { address, isConnected } = useAccount();

  if (!isConnected || !address) {
    return null;
  }

  return (
    <Card className="w-full max-w-md mx-auto mb-8">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Wallet</CardTitle>
        <p className="text-sm text-muted-foreground pt-1">{truncate(address)}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 pt-2 border-t">
          <BalanceDisplay address={address} token={USDT_ADDRESS} symbol="USDT" />
          <BalanceDisplay address={address} token={USDC_ADDRESS} symbol="USDC" muted />
          <BalanceDisplay address={address} token={USDM_ADDRESS} symbol="USDm" muted />
        </div>
        <p className="text-xs text-muted-foreground/70 pt-2 border-t">
          Mondeto currently accepts USDT only. Swap inside MiniPay to use USDC or USDm.
        </p>
      </CardContent>
    </Card>
  );
}
