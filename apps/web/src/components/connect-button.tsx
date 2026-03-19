"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";

export function ConnectButton() {
  const { login, logout, authenticated, ready } = usePrivy();
  const { chain, isConnected } = useAccount();
  const [isMiniPay, setIsMiniPay] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum && (window.ethereum as any).isMiniPay) {
      setIsMiniPay(true);
    }
  }, []);

  // In MiniPay, wallet auto-connects — no button needed
  if (isMiniPay) return null;

  if (!ready) return null;

  // If wagmi is connected (e.g. via injected) but Privy isn't authenticated,
  // show the chain name
  if (isConnected && !authenticated) {
    return (
      <button
        onClick={login}
        style={{
          fontSize: 6,
          fontFamily: "'Press Start 2P', monospace",
          letterSpacing: 1,
          padding: "4px 8px",
          borderRadius: 8,
          border: "1px solid var(--text-muted)",
          background: "transparent",
          color: "var(--text-muted)",
          cursor: "pointer",
        }}
      >
        {chain?.name?.replace("Celo ", "").replace(" Testnet", "") || "connect"}
      </button>
    );
  }

  if (!authenticated) {
    return (
      <button
        onClick={login}
        style={{
          fontSize: 7,
          fontFamily: "'Press Start 2P', monospace",
          letterSpacing: 1,
          padding: "4px 8px",
          borderRadius: 10,
          border: "1px solid var(--text-muted)",
          background: "transparent",
          color: "var(--text)",
          cursor: "pointer",
        }}
      >
        connect
      </button>
    );
  }

  return (
    <button
      onClick={logout}
      style={{
        fontSize: 6,
        fontFamily: "'Press Start 2P', monospace",
        letterSpacing: 1,
        padding: "4px 8px",
        borderRadius: 8,
        border: "1px solid var(--text-muted)",
        background: "transparent",
        color: "var(--text-muted)",
        cursor: "pointer",
      }}
    >
      {chain?.name?.replace("Celo ", "").replace(" Testnet", "") || "connected"}
    </button>
  );
}
