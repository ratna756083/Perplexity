import React, { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router'
import { useSelector } from 'react-redux'
import { useAuth } from '../hooks/useAuth'

/* ─────────────────────────────────────────────────────────────
   STITCH DESIGN SYSTEM - ICONS & GRAPHICS
───────────────────────────────────────────────────────────── */

const GoogleLogo = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
    <path
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      fill="#4285F4"
    />
    <path
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
      fill="#34A853"
    />
    <path
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      fill="#FBBC05"
    />
    <path
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      fill="#EA4335"
    />
  </svg>
)

const IconMail = () => (
  <svg className="w-5 h-5 text-slate-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const IconLock = () => (
  <svg className="w-5 h-5 text-slate-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const IconEye = ({ open }) => (
  open ? (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
)

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */

const Login = () => {
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [localError, setLocalError] = useState('')

  const { handelLogin } = useAuth()
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)
  const loading = useSelector((state) => state.auth.loading)
  const authError = useSelector((state) => state.auth.error)

  // Redirect if already authenticated
  if (!loading && user) {
    return <Navigate to="/" />
  }

  // Google OAuth redirect to backend
  const handleGoogleAuth = () => {
    window.location.href = 'https://perplexity-wbhi.onrender.com/api/auth/google'
  }

  async function handelSubmit(e) {
    e.preventDefault()
    setLocalError('')

    if (!email || !password) {
      setLocalError('Please enter both email and password.')
      return
    }

    try {
      await handelLogin({ email, password })
      navigate('/')
    } catch (err) {
      setLocalError('Authentication failed. Please verify your credentials.')
    }
  }

  return (
    <div className="relative min-h-screen bg-[#050816] text-[#dfe1f6] overflow-x-hidden selection:bg-[#7c3aed] selection:text-white font-sans">

      {/* ── BACKGROUND STRATUM: COSMIC GRID & GLOW ORBS (from Stitch) ── */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.16) 0%, transparent 65%),
            linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 48px 48px, 48px 48px'
        }}
      />

      {/* Floating ionized glow orbs */}
      <div className="fixed -top-40 -left-32 w-[600px] h-[600px] bg-[#7c3aed]/20 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="fixed top-1/2 -right-40 w-[550px] h-[550px] bg-[#44e2cd]/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed -bottom-48 left-1/3 w-[650px] h-[650px] bg-[#515cc5]/18 rounded-full blur-[180px] pointer-events-none" />

      {/* ── TOP TELEMETRY NAVBAR ── */}
      <header className="relative z-40 w-full border-b border-white/10 bg-[#0f1321]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Logo / Brand Anchor */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="relative w-10 h-10 rounded-xl bg-[#262939] border border-white/15 flex items-center justify-center p-1.5 shadow-[0_0_20px_rgba(124,58,237,0.35)] group-hover:shadow-[0_0_28px_rgba(68,226,205,0.45)] transition-all duration-300">
              <div className="w-full h-full rounded-lg bg-gradient-to-tr from-[#7c3aed] via-[#732ee4] to-[#44e2cd] flex items-center justify-center">
                {/* 3D Isometric Cube Icon */}
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#44e2cd] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#44e2cd]" />
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white font-['Space_Grotesk']">
                Perplexity<span className="text-[#d2bbff]">City</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#303444] border border-white/10 text-[#44e2cd] text-[10px] tracking-wider font-semibold font-mono">
                v2.5 AI Core
              </span>
            </div>
          </Link>

          {/* Telemetry pill & Return button */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#171b2a]/80 border border-white/10 backdrop-blur-md">
              <span className="inline-block w-2 h-2 rounded-full bg-[#44e2cd] shadow-[0_0_8px_#44e2cd]" />
              <span className="font-mono text-[11px] text-slate-300">
                Nodes Online: <span className="text-[#44e2cd] font-semibold">99.98%</span>
              </span>
              <span className="text-slate-600">|</span>
              <span className="font-mono text-[11px] text-slate-300">
                Latency: <span className="text-[#d2bbff] font-semibold">12ms</span>
              </span>
            </div>

            <Link
              to="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-[#171b2a]/60 hover:border-[#7c3aed]/50 text-slate-300 hover:text-white transition-all duration-200 text-xs font-semibold"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span className="hidden md:inline">Return to Hub</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT (SPLIT RESPONSIVE LAYOUT) ── */}
      <main className="relative z-20 max-w-7xl w-full mx-auto min-h-[calc(100vh-80px)] px-6 py-8 lg:py-12 flex items-center">
        <div className="w-full grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">

          {/* ════════════ LEFT PANEL: Brand Narrative & Capability Matrix ════════════ */}
          <section className="lg:col-span-7 flex flex-col justify-center space-y-8 order-2 lg:order-1">
            <div className="space-y-6">

              {/* Status Capsule */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#171b2a] border border-[#7c3aed]/40 shadow-[0_0_16px_-4px_rgba(124,58,237,0.4)]">
                <span className="h-2 w-2 rounded-full bg-[#7c3aed] animate-ping" />
                <span className="font-mono text-[#d2bbff] tracking-wide uppercase text-[11px] font-semibold">
                  Neural Cluster Allocation Active
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight font-['Space_Grotesk']">
                Welcome Back to the{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d2bbff] via-[#44e2cd] to-[#bdc2ff]">
                  Synthesis Frontier.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed">
                Connect your sovereign node to resume real-time compute, private knowledge bases, and multi-agent synthesis.
              </p>

              {/* 2x2 Feature Capability Matrix Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">

                {/* Card 1 */}
                <div className="p-4 rounded-xl bg-[#171b2a]/60 backdrop-blur-md border border-white/10 hover:border-[#44e2cd]/40 hover:bg-[#202644]/70 transition-all duration-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-1.5">
                    <div className="w-8 h-8 rounded-lg bg-[#0f1321] flex items-center justify-center text-[#44e2cd] border border-[#44e2cd]/20">
                      ⚡
                    </div>
                    <h2 className="text-sm font-semibold text-white font-['Space_Grotesk']">
                      Sub-Second Inference
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400 pl-11">
                    Zero-latency streaming
                  </p>
                </div>

                {/* Card 2 */}
                <div className="p-4 rounded-xl bg-[#171b2a]/60 backdrop-blur-md border border-white/10 hover:border-[#7c3aed]/40 hover:bg-[#202644]/70 transition-all duration-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-1.5">
                    <div className="w-8 h-8 rounded-lg bg-[#0f1321] flex items-center justify-center text-[#d2bbff] border border-[#7c3aed]/20">
                      🔒
                    </div>
                    <h2 className="text-sm font-semibold text-white font-['Space_Grotesk']">
                      End-to-End Encryption
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400 pl-11">
                    Zero-knowledge proofs
                  </p>
                </div>

                {/* Card 3 */}
                <div className="p-4 rounded-xl bg-[#171b2a]/60 backdrop-blur-md border border-white/10 hover:border-[#bdc2ff]/40 hover:bg-[#202644]/70 transition-all duration-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-1.5">
                    <div className="w-8 h-8 rounded-lg bg-[#0f1321] flex items-center justify-center text-[#bdc2ff] border border-[#bdc2ff]/20">
                      🧠
                    </div>
                    <h2 className="text-sm font-semibold text-white font-['Space_Grotesk']">
                      Neural Memory Recall
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400 pl-11">
                    Persistent semantic graphs
                  </p>
                </div>

                {/* Card 4 */}
                <div className="p-4 rounded-xl bg-[#171b2a]/60 backdrop-blur-md border border-white/10 hover:border-[#44e2cd]/40 hover:bg-[#202644]/70 transition-all duration-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-1.5">
                    <div className="w-8 h-8 rounded-lg bg-[#0f1321] flex items-center justify-center text-[#62fae3] border border-[#44e2cd]/20">
                      ⚡
                    </div>
                    <h2 className="text-sm font-semibold text-white font-['Space_Grotesk']">
                      99.99% Uptime SLA
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400 pl-11">
                    Decentralized failover
                  </p>
                </div>

              </div>

            </div>
          </section>

          {/* ════════════ RIGHT PANEL: Glassmorphism Authentication Terminal ════════════ */}
          <section className="lg:col-span-5 flex justify-center order-1 lg:order-2">
            <div className="w-full max-w-xl rounded-3xl bg-[#171b2a]/75 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(15,19,33,0.8),0_0_40px_-10px_rgba(124,58,237,0.3)] p-6 sm:p-8 relative overflow-hidden">
              
              {/* Specular Edge Highlight */}
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent" />

              {/* Terminal Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight font-['Space_Grotesk']">
                    Authenticate Node
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Enter your credentials or use Google Single Sign-On.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#44e2cd]/10 border border-[#44e2cd]/30 font-mono text-[11px] text-[#44e2cd]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#44e2cd] shadow-[0_0_6px_#44e2cd]" />
                  Secure Session
                </span>
              </div>

              {/* ── GOOGLE AUTH BUTTON ── */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full py-3 px-4 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all duration-200 hover:scale-[1.01] active:scale-[0.98] shadow-md cursor-pointer"
              >
                <GoogleLogo />
                <span>Continue with Google</span>
              </button>

              {/* Divider */}
              <div className="relative my-6 flex items-center justify-center">
                <div className="w-full border-t border-white/10" />
                <span className="absolute px-3 bg-[#141829] border border-white/10 rounded-full font-mono text-[10px] text-slate-400 tracking-widest uppercase">
                  OR SIGN IN WITH EMAIL
                </span>
              </div>

              {/* Status / Error Message */}
              {(localError || authError) && (
                <div
                  role="alert"
                  className="mb-4 flex items-center gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs text-rose-300 font-medium"
                >
                  <span>⚠️</span>
                  <span>{localError || authError}</span>
                </div>
              )}

              {/* ── CREDENTIALS FORM ── */}
              <form onSubmit={handelSubmit} className="space-y-4" noValidate>

                {/* Email Field */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="block font-mono text-[11px] text-slate-400 uppercase tracking-wider"
                  >
                    Neural Link / Email
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5">
                      <IconMail />
                    </span>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setemail(e.target.value)}
                      placeholder="alex@domain.ai"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0c1026] text-white placeholder:text-slate-600 border border-white/10 focus:outline-none focus:border-[#44e2cd] focus:ring-1 focus:ring-[#44e2cd]/40 transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="password"
                    className="block font-mono text-[11px] text-slate-400 uppercase tracking-wider"
                  >
                    Passphrase / Password
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5">
                      <IconLock />
                    </span>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setpassword(e.target.value)}
                      placeholder="••••••••••••••••"
                      required
                      className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-[#0c1026] text-white placeholder:text-slate-600 border border-white/10 focus:outline-none focus:border-[#44e2cd] focus:ring-1 focus:ring-[#44e2cd]/40 transition-all text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label="Toggle password visibility"
                      className="absolute right-3 text-slate-400 hover:text-white transition-colors p-1"
                    >
                      <IconEye open={showPassword} />
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded bg-[#0c1026] border-white/20 text-[#7c3aed] focus:ring-0"
                    />
                    <span className="text-xs text-slate-400">Remember this device</span>
                  </label>
                  <a href="#" className="text-xs text-[#44e2cd] hover:text-[#62fae3] transition-colors font-medium">
                    Forgot passphrase?
                  </a>
                </div>

                {/* Submit CTA */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-teal-400 hover:opacity-95 text-white font-bold tracking-wider uppercase text-xs flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25 transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Authenticating Node...</span>
                      </>
                    ) : (
                      <>
                        <span>SIGN IN TO NODE</span>
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>

              </form>

              {/* Navigation Link to Register */}
              <div className="mt-6 pt-5 border-t border-white/10 text-center">
                <p className="text-xs text-slate-400">
                  New to PerplexityCity?{' '}
                  <Link
                    to="/register"
                    className="text-[#44e2cd] font-semibold hover:text-[#62fae3] transition-colors inline-flex items-center gap-1 ml-1 hover:underline"
                  >
                    Create account →
                  </Link>
                </p>
              </div>

              {/* Fine Print */}
              <p className="mt-4 font-mono text-[10px] text-center text-slate-500 leading-relaxed">
                By authenticating, you agree to PerplexityCity Terms of Synthesis &amp; Privacy Protocol.
              </p>

            </div>
          </section>

        </div>
      </main>

      {/* ── FOOTER (Stitch Aligned) ── */}
      <footer className="relative z-30 w-full border-t border-white/10 bg-[#0a0d1c] mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-6 py-6 max-w-7xl mx-auto gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <span className="text-sm font-bold text-white font-['Space_Grotesk']">PerplexityCity</span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="text-xs text-slate-400">© 2025 PerplexityCity Compute Labs. All neural rights reserved.</span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <a href="#" className="hover:text-[#44e2cd] transition-colors">Privacy Protocol</a>
            <a href="#" className="hover:text-[#44e2cd] transition-colors">Terms of Synthesis</a>
            <a href="#" className="hover:text-[#44e2cd] transition-colors">Security Core</a>
            <a href="#" className="hover:text-[#44e2cd] transition-colors">System Status</a>
          </nav>
        </div>
      </footer>

    </div>
  )
}

export default Login
