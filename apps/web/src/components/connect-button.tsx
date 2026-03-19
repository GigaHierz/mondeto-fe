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
                fontFamily: "monospace",
                letterSpacing: 0.5,
                padding: "3px 8px",
                borderRadius: 10,
                border: "1px solid var(--border)",
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
              fontFamily: "monospace",
              letterSpacing: 0.3,
              padding: "2px 6px",
              borderRadius: 8,
              border: "1px solid var(--border)",
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
