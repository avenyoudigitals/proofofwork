import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions — ProofForge',
  description: 'Read the ProofForge Terms of Service, Privacy Policy, and Cookie Policy.',
}

/* ── Shared section heading ────────────────────────────────────── */
function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="mb-5 mt-14 text-xl font-black scroll-mt-24"
      style={{ color: '#f8fafc', letterSpacing: '-0.01em', borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: 12 }}
    >
      {children}
    </h2>
  )
}

function Sub({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-2 mt-6 text-sm font-bold" style={{ color: '#c4b5fd' }}>{children}</h3>
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 text-sm leading-7" style={{ color: '#475569' }}>{children}</p>
}

function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 mb-2">
      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: '#7c3aed' }} />
      <span className="text-sm leading-6" style={{ color: '#475569' }}>{children}</span>
    </li>
  )
}

function InfoBox({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div className="my-5 rounded-xl p-4"
      style={{ background: `${color}08`, border: `1px solid ${color}20`, borderLeft: `3px solid ${color}` }}>
      <p className="text-xs leading-6" style={{ color: '#94a3b8' }}>{children}</p>
    </div>
  )
}

const LAST_UPDATED = 'May 31, 2026'
const EFFECTIVE  = 'June 1, 2026'

const TOC = [
  { id: 'acceptance',         label: '1. Acceptance of Terms' },
  { id: 'description',        label: '2. Service Description' },
  { id: 'eligibility',        label: '3. Eligibility' },
  { id: 'accounts',           label: '4. User Accounts' },
  { id: 'content',            label: '5. User Content & Submissions' },
  { id: 'verification',       label: '6. Verification Standards' },
  { id: 'prohibited',         label: '7. Prohibited Conduct' },
  { id: 'ip',                 label: '8. Intellectual Property' },
  { id: 'privacy',            label: '9. Privacy Policy' },
  { id: 'cookies',            label: '10. Cookie Policy' },
  { id: 'payments',           label: '11. Payments & Subscriptions' },
  { id: 'disclaimers',        label: '12. Disclaimers' },
  { id: 'liability',          label: '13. Limitation of Liability' },
  { id: 'indemnification',    label: '14. Indemnification' },
  { id: 'termination',        label: '15. Termination' },
  { id: 'changes',            label: '16. Changes to Terms' },
  { id: 'governing',          label: '17. Governing Law' },
  { id: 'contact',            label: '18. Contact Us' },
]

export default function TermsPage() {
  return (
    <div className="relative z-10 min-h-screen" style={{ background: '#05050f' }}>

      {/* ── Header ── */}
      <header
        className="sticky top-0 z-50 flex h-14 items-center justify-between px-6"
        style={{
          background: 'rgba(5,5,15,0.92)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-full"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 0 12px rgba(124,58,237,0.4)' }}>
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="text-sm font-bold text-white tracking-tight">ProofForge</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-xs" style={{ color: '#334155' }}>Updated {LAST_UPDATED}</span>
          <Link href="/"
            className="rounded-lg px-3 py-1.5 text-xs font-medium transition"
            style={{ color: '#94a3b8', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            ← Back to home
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 pb-24 pt-12 lg:flex lg:gap-16">

        {/* ── Sidebar TOC ── */}
        <aside className="hidden lg:block w-56 shrink-0">
          <nav className="sticky top-20">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: '#334155' }}>
              On this page
            </p>
            <ul className="space-y-1">
              {TOC.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`}
                    className="block rounded-lg px-2 py-1.5 text-[11px] font-medium transition hover:opacity-80"
                    style={{ color: '#334155' }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* ── Main content ── */}
        <main className="min-w-0 flex-1">

          {/* Hero */}
          <div className="mb-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
              style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', color: '#a78bfa' }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#7c3aed' }} />
              Legal Documents
            </div>
            <h1 className="mb-3 text-4xl font-black" style={{ color: '#f8fafc', letterSpacing: '-0.02em' }}>
              Terms &amp; Conditions
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs" style={{ color: '#334155' }}>
              <span>Last updated: <strong style={{ color: '#94a3b8' }}>{LAST_UPDATED}</strong></span>
              <span className="h-1 w-1 rounded-full" style={{ background: '#1e293b' }} />
              <span>Effective: <strong style={{ color: '#94a3b8' }}>{EFFECTIVE}</strong></span>
              <span className="h-1 w-1 rounded-full" style={{ background: '#1e293b' }} />
              <span>Version: <strong style={{ color: '#94a3b8' }}>2.0</strong></span>
            </div>
          </div>

          <InfoBox color="#7c3aed">
            Please read these Terms and Conditions carefully before using ProofForge. By accessing or using our platform you agree to be bound by these terms. If you disagree with any part of these terms, you may not access the service.
          </InfoBox>

          {/* ── 1. Acceptance ── */}
          <SectionHeading id="acceptance">1. Acceptance of Terms</SectionHeading>
          <P>By creating an account, clicking &ldquo;I Agree&rdquo;, or otherwise accessing or using the ProofForge platform (&ldquo;Service&rdquo;, &ldquo;Platform&rdquo;, or &ldquo;ProofForge&rdquo;), operated by ProofForge Inc. (&ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), you (&ldquo;User&rdquo;, &ldquo;you&rdquo;) agree to be bound by these Terms and Conditions, our Privacy Policy, and Cookie Policy.</P>
          <P>These terms constitute a legally binding agreement. If you are using the Service on behalf of an organization, you represent that you have the authority to bind that organization to these terms.</P>

          {/* ── 2. Description ── */}
          <SectionHeading id="description">2. Service Description</SectionHeading>
          <P>ProofForge is a professional verification platform that enables individuals to:</P>
          <ul className="mb-4 ml-2 space-y-0">
            <Li>Upload and showcase professional work, contributions, and projects</Li>
            <Li>Connect third-party accounts (GitHub, Figma, etc.) to surface verified contributions</Li>
            <Li>Request peer co-signing of professional contributions</Li>
            <Li>Receive official verification seals from verified partner companies</Li>
            <Li>Build a cryptographically-backed proof-of-work portfolio</Li>
            <Li>Discover and be discovered by companies and collaborators</Li>
          </ul>
          <P>We reserve the right to modify, suspend, or discontinue any part of the Service at any time with or without notice.</P>

          {/* ── 3. Eligibility ── */}
          <SectionHeading id="eligibility">3. Eligibility</SectionHeading>
          <P>To use ProofForge you must:</P>
          <ul className="mb-4 ml-2 space-y-0">
            <Li>Be at least 16 years of age (or 18 in jurisdictions requiring adult consent)</Li>
            <Li>Have the legal capacity to enter into a binding contract</Li>
            <Li>Not be prohibited from receiving the Service under applicable laws</Li>
            <Li>Not have a previously terminated ProofForge account due to a violation of these terms</Li>
          </ul>

          {/* ── 4. Accounts ── */}
          <SectionHeading id="accounts">4. User Accounts</SectionHeading>
          <Sub>4.1 Registration</Sub>
          <P>You may register using a supported OAuth provider (GitHub, Google) or email and password. You agree to provide accurate, current, and complete information during registration.</P>
          <Sub>4.2 Account Security</Sub>
          <P>You are responsible for maintaining the confidentiality of your credentials and for all activities that occur under your account. Notify us immediately at security@proofforge.app of any unauthorized use.</P>
          <Sub>4.3 One Account Per Person</Sub>
          <P>Each individual may maintain only one free account. Operating multiple accounts to circumvent limits or manipulate reputation scores is a violation of these terms.</P>
          <InfoBox color="#f59e0b">
            We reserve the right to suspend or terminate accounts that we believe are being operated fraudulently, in bad faith, or in violation of these terms without prior notice.
          </InfoBox>

          {/* ── 5. User Content ── */}
          <SectionHeading id="content">5. User Content &amp; Submissions</SectionHeading>
          <Sub>5.1 Your Ownership</Sub>
          <P>You retain all intellectual property rights to content you upload (&ldquo;User Content&rdquo;). By submitting content to ProofForge you grant us a worldwide, non-exclusive, royalty-free license to store, display, process, and distribute that content solely for the purpose of operating the Service.</P>
          <Sub>5.2 Content Standards</Sub>
          <P>You represent and warrant that all User Content you submit:</P>
          <ul className="mb-4 ml-2 space-y-0">
            <Li>Is accurate, truthful, and not misleading</Li>
            <Li>Represents work you actually contributed to</Li>
            <Li>Does not violate any third-party intellectual property, privacy, or confidentiality rights</Li>
            <Li>Does not contain any malware, viruses, or harmful code</Li>
            <Li>Complies with any confidentiality agreements you may have with employers</Li>
          </ul>
          <Sub>5.3 False Claims</Sub>
          <P>Submitting fabricated or materially false work contributions is a serious violation. ProofForge employs automated and manual review processes. Accounts found submitting fraudulent work will be immediately suspended and may be reported to relevant parties.</P>

          {/* ── 6. Verification ── */}
          <SectionHeading id="verification">6. Verification Standards</SectionHeading>
          <P>ProofForge offers three tiers of verification with different levels of evidentiary weight:</P>
          <div className="my-5 grid gap-3 sm:grid-cols-3">
            {[
              { tier: 'Self Claimed',     desc: 'Submitted by the user. No independent validation. Marked clearly on the profile.',                   color: '#475569' },
              { tier: 'Peer Verified',    desc: 'Co-signed by at least one colleague who attests to your contribution. Co-signers are liable for false attestations.', color: '#818cf8' },
              { tier: 'Company Verified', desc: 'Officially endorsed by a partner company. Carries the highest evidentiary weight and legal accountability.', color: '#10b981' },
            ].map((v) => (
              <div key={v.tier} className="rounded-xl p-4"
                style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${v.color}20` }}>
                <div className="h-1.5 w-1.5 rounded-full mb-2" style={{ background: v.color }} />
                <p className="text-xs font-bold mb-1" style={{ color: v.color }}>{v.tier}</p>
                <p className="text-[11px] leading-5" style={{ color: '#334155' }}>{v.desc}</p>
              </div>
            ))}
          </div>
          <P>ProofForge makes no guarantee that any verification is free from error. Users and companies relying on verification data do so at their own risk.</P>

          {/* ── 7. Prohibited ── */}
          <SectionHeading id="prohibited">7. Prohibited Conduct</SectionHeading>
          <P>You agree not to engage in any of the following:</P>
          <ul className="mb-4 ml-2 space-y-0">
            <Li>Submitting false, fabricated, or plagiarized work submissions</Li>
            <Li>Impersonating any person, company, or entity</Li>
            <Li>Reverse engineering, decompiling, or disassembling any part of the platform</Li>
            <Li>Using automated scripts, bots, or scrapers to access the platform</Li>
            <Li>Attempting to gain unauthorized access to any account or system</Li>
            <Li>Circumventing, disabling, or interfering with security features</Li>
            <Li>Uploading content that infringes third-party confidentiality obligations</Li>
            <Li>Harassing, threatening, or abusing other users</Li>
            <Li>Manipulating reputation scores through artificial means</Li>
            <Li>Engaging in any activity that violates applicable law or regulation</Li>
          </ul>

          {/* ── 8. IP ── */}
          <SectionHeading id="ip">8. Intellectual Property</SectionHeading>
          <P>The ProofForge name, logo, platform design, source code, algorithms, and all associated materials are the exclusive intellectual property of ProofForge Inc., protected by copyright, trademark, and trade secret laws.</P>
          <P>You may not reproduce, distribute, modify, create derivative works of, publicly display, or commercially exploit any part of the platform without our express written consent.</P>
          <P>The &ldquo;ProofForge&rdquo;, &ldquo;Proof of Work. Verified.&rdquo;, and associated marks are trademarks of ProofForge Inc.</P>

          {/* ── 9. Privacy ── */}
          <SectionHeading id="privacy">9. Privacy Policy</SectionHeading>
          <P>Your privacy is fundamental to us. This section summarizes how we collect, use, and protect your data.</P>
          <Sub>9.1 Data We Collect</Sub>
          <ul className="mb-4 ml-2 space-y-0">
            <Li><strong style={{ color: '#94a3b8' }}>Account data:</strong> Name, email, profile picture from your OAuth provider</Li>
            <Li><strong style={{ color: '#94a3b8' }}>Contribution data:</strong> Work submissions, linked repositories, design files</Li>
            <Li><strong style={{ color: '#94a3b8' }}>Usage data:</strong> Pages visited, features used, device and browser type</Li>
            <Li><strong style={{ color: '#94a3b8' }}>Communication data:</strong> Messages to our support team</Li>
            <Li><strong style={{ color: '#94a3b8' }}>Third-party data:</strong> Information retrieved from GitHub, Figma APIs with your consent</Li>
          </ul>
          <Sub>9.2 How We Use Your Data</Sub>
          <ul className="mb-4 ml-2 space-y-0">
            <Li>Provide, maintain, and improve the Service</Li>
            <Li>Authenticate your identity and secure your account</Li>
            <Li>Process and display your verified work profile</Li>
            <Li>Send transactional emails (verification updates, security alerts)</Li>
            <Li>Analyse usage patterns to improve the platform</Li>
            <Li>Comply with legal obligations</Li>
          </ul>
          <Sub>9.3 Data Sharing</Sub>
          <P>We do not sell your personal data. We may share data with:</P>
          <ul className="mb-4 ml-2 space-y-0">
            <Li>Partner companies — only the specific verification data you authorize them to see</Li>
            <Li>Service providers — Supabase (database), Resend (email), Vercel (hosting) under strict data processing agreements</Li>
            <Li>Law enforcement — when required by applicable law or court order</Li>
          </ul>
          <Sub>9.4 Data Retention</Sub>
          <P>We retain your account data for as long as your account is active. Upon deletion, personal data is purged within 30 days, except where retention is required by law.</P>
          <Sub>9.5 Your Rights (GDPR / CCPA)</Sub>
          <P>Depending on your jurisdiction you have the right to: access, correct, export, or delete your personal data; withdraw consent; opt out of marketing; and lodge a complaint with your supervisory authority. Contact privacy@proofforge.app to exercise these rights.</P>
          <InfoBox color="#10b981">
            We use Supabase for all data storage, which is SOC 2 Type II certified and stores data in the EU-West region by default. You can request a copy of all your data at any time by emailing privacy@proofforge.app.
          </InfoBox>

          {/* ── 10. Cookies ── */}
          <SectionHeading id="cookies">10. Cookie Policy</SectionHeading>
          <P>Cookies are small text files placed on your device to enhance your experience. ProofForge uses the following categories:</P>
          <div className="my-5 space-y-3">
            {[
              {
                name: 'Essential / Strictly Necessary',
                color: '#10b981',
                always: true,
                desc: 'Required for the platform to function. Cannot be disabled.',
                examples: ['Authentication tokens (supabase-auth-token)', 'CSRF protection cookies', 'Session state', 'Cookie consent preference (pf_cookie_consent)'],
              },
              {
                name: 'Analytics & Performance',
                color: '#7c3aed',
                always: false,
                desc: 'Help us understand how users interact with the platform so we can improve it.',
                examples: ['Page view tracking', 'Feature usage analytics', 'Error monitoring (anonymized)', 'Performance metrics'],
              },
              {
                name: 'Preferences & Functional',
                color: '#38bdf8',
                always: false,
                desc: 'Remember your settings and preferences to personalise your experience.',
                examples: ['UI theme preferences', 'Language settings', 'Dashboard layout preferences', 'Notification preferences'],
              },
            ].map((cat) => (
              <div key={cat.name} className="rounded-2xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${cat.color}18` }}>
                <div className="flex items-center justify-between px-5 py-3"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex items-center gap-2.5">
                    <div className="h-2 w-2 rounded-full" style={{ background: cat.color }} />
                    <span className="text-sm font-bold" style={{ color: '#f8fafc' }}>{cat.name}</span>
                  </div>
                  {cat.always
                    ? <span className="text-[9px] font-bold uppercase tracking-wide rounded-full px-2 py-0.5"
                        style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>
                        Always Active
                      </span>
                    : <span className="text-[9px] font-bold uppercase tracking-wide rounded-full px-2 py-0.5"
                        style={{ background: 'rgba(255,255,255,0.04)', color: '#475569', border: '1px solid rgba(255,255,255,0.08)' }}>
                        Optional
                      </span>
                  }
                </div>
                <div className="px-5 py-4">
                  <p className="mb-3 text-xs leading-5" style={{ color: '#475569' }}>{cat.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.examples.map((ex) => (
                      <span key={ex} className="rounded-md px-2 py-0.5 text-[10px]"
                        style={{ background: 'rgba(255,255,255,0.04)', color: '#334155', border: '1px solid rgba(255,255,255,0.07)' }}>
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Sub>10.1 Managing Cookies</Sub>
          <P>You can manage cookie preferences at any time through the cookie banner (accessible by clearing your browser&apos;s local storage for our domain) or through your browser settings. Note that disabling essential cookies will prevent you from using the platform.</P>

          {/* ── 11. Payments ── */}
          <SectionHeading id="payments">11. Payments &amp; Subscriptions</SectionHeading>
          <P>ProofForge offers a free tier for individual professionals. Premium and Company plans are available with additional features.</P>
          <ul className="mb-4 ml-2 space-y-0">
            <Li>All payments are processed securely through Stripe. We do not store card details.</Li>
            <Li>Subscriptions auto-renew unless cancelled before the renewal date.</Li>
            <Li>Refunds are available within 14 days of initial purchase for annual plans.</Li>
            <Li>Plan downgrades take effect at the end of the current billing period.</Li>
            <Li>We reserve the right to change pricing with 30 days&apos; notice to existing subscribers.</Li>
          </ul>

          {/* ── 12. Disclaimers ── */}
          <SectionHeading id="disclaimers">12. Disclaimers</SectionHeading>
          <P>THE SERVICE IS PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</P>
          <P>We do not warrant that the Service will be uninterrupted, error-free, or completely secure. We make no representations about the accuracy or completeness of user-submitted content.</P>
          <InfoBox color="#f43f5e">
            ProofForge verified badges indicate that a verification process has occurred — they do not constitute an employment recommendation, character endorsement, or legal attestation by ProofForge Inc.
          </InfoBox>

          {/* ── 13. Liability ── */}
          <SectionHeading id="liability">13. Limitation of Liability</SectionHeading>
          <P>TO THE MAXIMUM EXTENT PERMITTED BY LAW, PROOFFORGE INC. AND ITS OFFICERS, EMPLOYEES, AGENTS, AND PARTNERS SHALL NOT BE LIABLE FOR:</P>
          <ul className="mb-4 ml-2 space-y-0">
            <Li>Any indirect, incidental, special, consequential, or punitive damages</Li>
            <Li>Loss of profits, data, goodwill, or business opportunities</Li>
            <Li>Damages resulting from unauthorized access to your account</Li>
            <Li>Actions of third-party verifiers, co-signers, or companies on the platform</Li>
            <Li>Any damages exceeding the greater of $100 USD or the amount you paid us in the 12 months prior to the claim</Li>
          </ul>

          {/* ── 14. Indemnification ── */}
          <SectionHeading id="indemnification">14. Indemnification</SectionHeading>
          <P>You agree to indemnify, defend, and hold harmless ProofForge Inc. and its affiliates from any claims, liabilities, damages, losses, and expenses (including reasonable legal fees) arising from your use of the Service, your User Content, your violation of these Terms, or your violation of any third-party rights.</P>

          {/* ── 15. Termination ── */}
          <SectionHeading id="termination">15. Termination</SectionHeading>
          <P>You may delete your account at any time from your account settings. We may suspend or terminate your access immediately if you breach these Terms.</P>
          <P>Upon termination: your license to use the Service ends; your profile and submitted content will be removed from public view within 48 hours; and we will purge your personal data within 30 days unless retention is required by law.</P>

          {/* ── 16. Changes ── */}
          <SectionHeading id="changes">16. Changes to Terms</SectionHeading>
          <P>We may update these Terms at any time. If we make material changes, we will notify you via email or a prominent banner within the platform at least 14 days before the changes take effect. Your continued use after the effective date constitutes acceptance of the updated Terms.</P>

          {/* ── 17. Governing Law ── */}
          <SectionHeading id="governing">17. Governing Law</SectionHeading>
          <P>These Terms are governed by the laws of the State of Delaware, United States, without regard to conflict of law principles. Any disputes shall be resolved through binding arbitration under the JAMS rules, except that either party may seek injunctive relief in a court of competent jurisdiction.</P>
          <P>If you are a consumer in the European Union, the mandatory consumer protection laws of your country of residence also apply.</P>

          {/* ── 18. Contact ── */}
          <SectionHeading id="contact">18. Contact Us</SectionHeading>
          <P>For questions about these Terms, Privacy Policy, or Cookie Policy, contact us at:</P>
          <div className="rounded-2xl p-6"
            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: 'General', email: 'hello@proofforge.app', icon: '✉' },
                { label: 'Privacy & Data', email: 'privacy@proofforge.app', icon: '🔒' },
                { label: 'Security', email: 'security@proofforge.app', icon: '🛡' },
              ].map((c) => (
                <div key={c.label} className="text-center">
                  <div className="text-lg mb-1">{c.icon}</div>
                  <p className="text-xs font-bold mb-0.5" style={{ color: '#94a3b8' }}>{c.label}</p>
                  <a href={`mailto:${c.email}`} className="text-xs transition hover:opacity-80" style={{ color: '#7c3aed' }}>
                    {c.email}
                  </a>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 text-center text-[11px]" style={{ color: '#334155', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              ProofForge Inc. · 2261 Market St #86319 · San Francisco, CA 94114 · USA
            </div>
          </div>

          {/* Effective date footer */}
          <div className="mt-14 rounded-2xl p-5 text-center"
            style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
            <p className="text-xs" style={{ color: '#475569' }}>
              These Terms are effective as of <strong style={{ color: '#a78bfa' }}>{EFFECTIVE}</strong> and supersede all prior agreements.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <Link href="/" className="rounded-xl px-4 py-2 text-xs font-semibold transition hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: '#fff', boxShadow: '0 4px 16px rgba(124,58,237,0.3)' }}>
                ← Back to ProofForge
              </Link>
              <Link href="/signup" className="rounded-xl px-4 py-2 text-xs font-semibold transition"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}>
                Create account
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
