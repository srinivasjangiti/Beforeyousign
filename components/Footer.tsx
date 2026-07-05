import Link from "next/link";

const socialLinks = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/srinivasajan/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "X / Twitter",
    href: "https://x.com/srinivasajan",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "Substack",
    href: "https://substack.com/@srinivasjan",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
      </svg>
    ),
  },
  {
    name: "Medium",
    href: "https://medium.com/srinivasajan",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@srinivasjan",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-900 text-stone-200 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-xl font-bold text-white mb-3">BeforeYouSign</h3>
            <p className="text-sm text-stone-400 leading-relaxed">
              Institutional-grade contract analysis powered by AI. Identify
              material risks, decode complex provisions, and safeguard your
              commercial interests.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/analyze"
                  className="text-sm text-stone-400 hover:text-white transition-colors"
                >
                  Analyze Contract
                </Link>
              </li>
              <li>
                <Link
                  href="/research"
                  className="text-sm text-stone-400 hover:text-white transition-colors"
                >
                  Research
                </Link>
              </li>
              <li>
                <Link
                  href="/templates"
                  className="text-sm text-stone-400 hover:text-white transition-colors"
                >
                  Templates
                </Link>
              </li>
              <li>
                <Link
                  href="/library"
                  className="text-sm text-stone-400 hover:text-white transition-colors"
                >
                  Legal Library
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-stone-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-stone-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/disclaimer"
                  className="text-sm text-stone-400 hover:text-white transition-colors"
                >
                  Legal Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Creator Card ── */}
        <div className="border-t border-stone-800 pt-8 mb-6">
          <div className="rounded-xl bg-gradient-to-br from-stone-800 via-stone-800 to-stone-900 border border-stone-700 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            {/* Left: identity */}
            <div className="flex items-center gap-4">
              {/* Avatar monogram */}
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, #78716c 0%, #44403c 100%)",
                }}
              >
                SJ
              </div>
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-widest mb-0.5">
                  Built by
                </p>
                <p className="text-base font-semibold text-white leading-tight">
                  Srinivas Jangiti
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                  <a
                    href="mailto:srinivasajan.work@gmail.com"
                    className="text-xs text-stone-400 hover:text-amber-400 transition-colors flex items-center gap-1"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      className="w-3 h-3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    srinivasajan.work@gmail.com
                  </a>
                  <span className="text-stone-700 hidden sm:inline">·</span>
                  <a
                    href="tel:+918767505121"
                    className="text-xs text-stone-400 hover:text-amber-400 transition-colors flex items-center gap-1"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      className="w-3 h-3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    +91 87675 05121
                  </a>
                </div>
              </div>
            </div>

            {/* Right: social icons */}
            <div className="flex items-center gap-2 flex-wrap">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  title={s.name}
                  className="w-8 h-8 rounded-lg bg-stone-700 hover:bg-amber-500 text-stone-300 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-stone-800 pt-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-sm text-stone-400">
              © {currentYear} BeforeYouSign. All rights reserved.
            </p>
            <p className="text-sm text-stone-500">
              AI-powered legal analysis. Not legal advice.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}