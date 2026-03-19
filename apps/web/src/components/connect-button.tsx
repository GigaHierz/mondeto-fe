"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useAccount } from "wagmi";

export function ConnectButton() {
  const { login, logout, authenticated, ready } = usePrivy();
  const { chain } = useAccount();

  if (!ready) return null;

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
