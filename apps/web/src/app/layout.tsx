import type { Metadata, Viewport } from 'next';
import './globals.css';
import { WalletProvider } from "@/components/wallet-provider"
import { ThemeProvider } from "@/lib/theme"

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
      <body
        className="font-mono antialiased"
        style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}
      >
        <div className="relative flex min-h-screen flex-col">
          <WalletProvider>
            <ThemeProvider>
              <main className="flex-1">
                {children}
              </main>
            </ThemeProvider>
          </WalletProvider>
        </div>
      </body>
    </html>
  );
}
