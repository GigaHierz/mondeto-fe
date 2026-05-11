import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy — Mondeto',
}

export default function PrivacyPage() {
  return (
    <article style={{ maxWidth: 720, margin: '0 auto', padding: '32px 20px', fontFamily: "'IBM Plex Mono', monospace", color: 'var(--text)', lineHeight: 1.6 }}>
      <h1 style={{ fontSize: 22, marginBottom: 8 }}>Privacy Policy</h1>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 24 }}>
        Last updated: <span style={{ fontStyle: 'italic' }}>DRAFT — pending legal review</span>
      </p>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, marginBottom: 8 }}>1. What this app does</h2>
        <p style={{ fontSize: 13 }}>
          Mondeto is a frontend for an on-chain pixel-buying game on Celo. It does not run a
          backend that stores user accounts. All gameplay state is on-chain and publicly readable
          via any Celo RPC node or block explorer.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, marginBottom: 8 }}>2. Data we receive</h2>
        <p style={{ fontSize: 13 }}>
          When you use Mondeto we may receive, via standard web traffic:
        </p>
        <ul style={{ fontSize: 13, paddingLeft: 24, marginTop: 8 }}>
          <li>Your wallet address (public on-chain).</li>
          <li>IP address and User-Agent from your browser or MiniPay WebView (collected by our
              hosting provider for security and operational logs).</li>
          <li>Anonymized analytics events (page views, button clicks) if analytics are enabled.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, marginBottom: 8 }}>3. Data we do not collect</h2>
        <ul style={{ fontSize: 13, paddingLeft: 24 }}>
          <li>Email addresses (unless you send us one through support).</li>
          <li>Phone numbers.</li>
          <li>Private keys, seed phrases, or wallet credentials — these never leave your device.</li>
          <li>KYC information.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, marginBottom: 8 }}>4. On-chain data is public</h2>
        <p style={{ fontSize: 13 }}>
          Pixel purchases, labels, and URLs you set are written to the Celo blockchain and are
          permanent, public, and outside our control. Do not put anything in a label or URL
          you would not want made public forever.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, marginBottom: 8 }}>5. Third parties we use</h2>
        <p style={{ fontSize: 13 }}>
          We use Vercel for hosting and Privy + WalletConnect for wallet connection on web (not in
          MiniPay). Their privacy policies apply when you interact with their services.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, marginBottom: 8 }}>6. Cookies</h2>
        <p style={{ fontSize: 13 }}>
          We use only essential cookies needed for the app to function (e.g. dark/light theme
          preference). No advertising or cross-site tracking cookies.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, marginBottom: 8 }}>7. Your rights</h2>
        <p style={{ fontSize: 13 }}>
          Where applicable (GDPR / CCPA / similar), you have the right to request access to and
          deletion of personal data we hold. Note: on-chain data (your wallet address, purchases,
          labels) cannot be deleted — that is the nature of public blockchains. Contact us at the
          support channel below to exercise off-chain rights.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, marginBottom: 8 }}>8. Changes</h2>
        <p style={{ fontSize: 13 }}>
          We will announce material changes in-app and on the support channel.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, marginBottom: 8 }}>9. Contact</h2>
        <p style={{ fontSize: 13 }}>
          Reach us at <a href="https://t.me/mondetoSupport" style={{ color: 'var(--accent)' }}>t.me/mondetoSupport</a>.
        </p>
      </section>

      <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 32 }}>
        <Link href="/" style={{ color: 'var(--accent)' }}>← Back to Mondeto</Link>
      </p>
    </article>
  )
}
