"use client";

import { ConnectButton as RainbowKitConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";

export function ConnectButton() {
  const [isMinipay, setIsMinipay] = useState(false);

  useEffect(() => {
    // @ts-ignore
    if (window.ethereum?.isMiniPay) {
      setIsMinipay(true);
    }
  }, []);

  if (isMinipay) {
    return null;
  }

  return (
    <RainbowKitConnectButton.Custom>
      {({ account, chain, openChainModal, openConnectModal, mounted }) => {
        const connected = mounted && account && chain;

        if (!mounted) return null;

        if (!connected) {
          return (
            <button
              onClick={openConnectModal}
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
            onClick={openChainModal}
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
            {chain.name?.replace("Celo ", "").replace(" Testnet", "")}
          </button>
        );
      }}
    </RainbowKitConnectButton.Custom>
  );
}
