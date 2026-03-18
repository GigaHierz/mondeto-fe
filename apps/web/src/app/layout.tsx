import type { Metadata, Viewport } from 'next';
import './globals.css';
import { WalletProvider } from "@/components/wallet-provider"

export const metadata: Metadata = {
  title: 'Mondeto',
  description: 'Own the world, one pixel at a time',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-mono antialiased">
        <div className="relative flex min-h-screen flex-col">
          <WalletProvider>
            <main className="flex-1">
              {children}
            </main>
          </WalletProvider>
        </div>
      </body>
    </html>
  );
}
