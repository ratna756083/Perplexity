import React, { useState } from 'react'
import { Link } from 'react-router'
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

const IconUser = () => (
  <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const IconMail = () => (
  <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const IconLock = () => (
  <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

const IconCheck = () => (
  <svg className="w-4 h-4 text-[#44e2cd]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const IconCircle = () => (
  <svg className="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
  </svg>
)

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */

const Register = () => {
  const [username, setusername] = useState('')
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [isErrorMessage, setIsErrorMessage] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { handelRegister } = useAuth()

  // Google OAuth URL pointing to backend
  const handleGoogleAuth = () => {
    window.location.href = 'https://perplexity-wbhi.onrender.com/api/auth/google'
  }

  // Password rules validation
  const hasLength = password.length >= 8
  const hasUpper = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  let score = 0
  if (hasLength) score++
  if (hasUpper) score++
  if (hasNumber) score++
  if (hasSymbol) score++

  const getStrengthMeta = () => {
    if (!password) return { label: 'Requirement Check', color: 'text-slate-400', pct: '0%' }
    if (score === 1) return { label: 'Weak (25%)', color: 'text-rose-400', pct: '25%' }
    if (score === 2) return { label: 'Fair (50%)', color: 'text-amber-400', pct: '50%' }
    if (score === 3) return { label: 'Good (75%)', color: 'text-yellow-400', pct: '75%' }
    return { label: 'Strong (100%)', color: 'text-[#44e2cd]', pct: '100%' }
  }

  const strengthMeta = getStrengthMeta()

  async function handelSubmit(e) {
    e.preventDefault()
    setMessage('')
    setIsErrorMessage(false)
    setIsLoading(true)

    try {
      const registration = await handelRegister({ username, email, password })
      if (registration?.user) {
        setMessage('Node allocated successfully! Please verify your email.')
      } else if (registration?.success === false && registration.message) {
        setMessage(registration.message)
        setIsErrorMessage(true)
      }
    } catch (err) {
      setMessage('Registration encountered an issue. Please retry.')
      setIsErrorMessage(true)
    } finally {
      setIsLoading(false)
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
      <div className="fixed top-1/2 -right-40 w-[520px] h-[520px] bg-[#44e2cd]/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed -bottom-40 left-1/3 w-[500px] h-[500px] bg-[#515cc5]/20 rounded-full blur-[160px] pointer-events-none" />

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

          {/* ════════════ LEFT PANEL: Brand Hero & Telemetry ════════════ */}
          <section className="lg:col-span-5 flex flex-col justify-center gap-8 order-2 lg:order-1">
            <div className="space-y-6">

              {/* Cluster capsule */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#171b2a] border border-[#7c3aed]/40 shadow-[0_0_16px_-4px_rgba(124,58,237,0.4)]">
                <span className="h-2 w-2 rounded-full bg-[#7c3aed] animate-ping" />
                <span className="font-mono text-[#d2bbff] tracking-wide uppercase text-[11px] font-semibold">
                  Neural Cluster Allocation Active
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight font-['Space_Grotesk']">
                Unlock the Frontier of{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d2bbff] via-[#44e2cd] to-[#bdc2ff]">
                  Autonomous Synthesis.
                </span>
              </h1>

              {/* Subtext */}
              <p className="text-base sm:text-lg text-slate-400 max-w-lg leading-relaxed">
                Your AI-powered knowledge hub — synthesize billions of parameters in sub-second latency with sovereign precision.
              </p>

              {/* 4 Pill Feature Badges */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                
                {/* 1. Instant Answers */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#171b2a]/70 backdrop-blur-md border border-[#7c3aed]/40 shadow-[0_0_20px_-8px_rgba(124,58,237,0.4)] hover:border-[#7c3aed] transition-all">
                  <div className="w-8 h-8 rounded-lg bg-[#7c3aed]/20 flex items-center justify-center text-[#d2bbff]">
                    ⚡
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white text-[13px] font-semibold">Instant Answers</span>
                    <span className="font-mono text-slate-400 text-[10px]">Zero Hallucination</span>
                  </div>
                </div>

                {/* 2. Deep Research */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#171b2a]/70 backdrop-blur-md border border-[#44e2cd]/40 shadow-[0_0_20px_-8px_rgba(68,226,205,0.35)] hover:border-[#44e2cd] transition-all">
                  <div className="w-8 h-8 rounded-lg bg-[#44e2cd]/15 flex items-center justify-center text-[#44e2cd]">
                    🔍
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white text-[13px] font-semibold">Deep Research</span>
                    <span className="font-mono text-slate-400 text-[10px]">Multi-Step Agents</span>
                  </div>
                </div>

                {/* 3. Web Search */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#171b2a]/70 backdrop-blur-md border border-[#515cc5]/50 shadow-[0_0_20px_-8px_rgba(81,92,197,0.4)] hover:border-[#818cf8] transition-all">
                  <div className="w-8 h-8 rounded-lg bg-[#515cc5]/25 flex items-center justify-center text-[#bdc2ff]">
                    🌐
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white text-[13px] font-semibold">Web Search</span>
                    <span className="font-mono text-slate-400 text-[10px]">Real-Time Indices</span>
                  </div>
                </div>

                {/* 4. AI Chat */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#171b2a]/70 backdrop-blur-md border border-[#03c6b2]/40 shadow-[0_0_20px_-8px_rgba(3,198,178,0.35)] hover:border-[#44e2cd] transition-all">
                  <div className="w-8 h-8 rounded-lg bg-[#03c6b2]/20 flex items-center justify-center text-[#62fae3]">
                    🤖
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white text-[13px] font-semibold">AI Chat</span>
                    <span className="font-mono text-slate-400 text-[10px]">Context Streaming</span>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* ════════════ RIGHT PANEL: Glassmorphism Registration Console ════════════ */}
          <section className="lg:col-span-7 flex justify-center order-1 lg:order-2">
            <div className="w-full max-w-xl rounded-3xl bg-[#171b2a]/75 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(15,19,33,0.8),0_0_40px_-10px_rgba(124,58,237,0.3)] p-6 sm:p-10 relative overflow-hidden">
              
              {/* Inset specular highlight along the card top */}
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent" />

              {/* Card Header */}
              <div className="mb-7">
                <div className="flex items-center justify-between mb-1.5">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-['Space_Grotesk']">
                    Create your node
                  </h2>
                  <span className="font-mono text-[11px] px-2.5 py-1 rounded bg-[#7c3aed]/20 border border-[#7c3aed]/40 text-[#d2bbff] font-medium">
                    Free Tier
                  </span>
                </div>
                <p className="text-sm text-slate-400">
                  Get started with <span className="text-[#44e2cd] font-semibold">10,000 free neural compute credits</span> today.
                </p>
              </div>

              {/* ── GOOGLE AUTH BUTTON (Primary CTA) ── */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full py-3.5 px-4 bg-white hover:bg-slate-100 text-slate-900 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all duration-200 hover:scale-[1.01] active:scale-[0.98] shadow-lg shadow-white/5 cursor-pointer"
              >
                <GoogleLogo />
                <span>Continue with Google</span>
              </button>

              {/* Divider */}
              <div className="relative my-6 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <span className="relative px-4 bg-[#141829] text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                  or sign up with email
                </span>
              </div>

              {/* Status / Alert Message */}
              {message && (
                <div
                  role={isErrorMessage ? 'alert' : 'status'}
                  className={`mb-5 flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium ${
                    isErrorMessage
                      ? 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                      : 'border-[#44e2cd]/30 bg-[#44e2cd]/10 text-[#44e2cd]'
                  }`}
                >
                  <span>{isErrorMessage ? '⚠️' : '✅'}</span>
                  <span>{message}</span>
                </div>
              )}

              {/* ── REGISTRATION FORM ── */}
              <form onSubmit={handelSubmit} className="space-y-4" noValidate>

                {/* 1. Username */}
                <div>
                  <label
                    htmlFor="username"
                    className="block font-mono text-[11px] text-slate-400 uppercase tracking-wider mb-1.5"
                  >
                    Node Handle / Username
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4">
                      <IconUser />
                    </span>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setusername(e.target.value)}
                      placeholder="e.g. alex_cipher"
                      required
                      className="w-full pl-11 pr-4 py-3 bg-[#0c1026] text-white placeholder:text-slate-600 rounded-2xl border border-white/10 focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/40 focus:outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                {/* 2. Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block font-mono text-[11px] text-slate-400 uppercase tracking-wider mb-1.5"
                  >
                    Neural Link / Email
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4">
                      <IconMail />
                    </span>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setemail(e.target.value)}
                      placeholder="alex@domain.ai"
                      required
                      className="w-full pl-11 pr-4 py-3 bg-[#0c1026] text-white placeholder:text-slate-600 rounded-2xl border border-white/10 focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/40 focus:outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                {/* 3. Password + Strength */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="password"
                      className="block font-mono text-[11px] text-slate-400 uppercase tracking-wider"
                    >
                      Passphrase Key
                    </label>
                    <span className={`font-mono text-[11px] font-semibold ${strengthMeta.color}`}>
                      {strengthMeta.label}
                    </span>
                  </div>

                  <div className="relative flex items-center">
                    <span className="absolute left-4">
                      <IconLock />
                    </span>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setpassword(e.target.value)}
                      placeholder="Create a secure passphrase"
                      required
                      className="w-full pl-11 pr-12 py-3 bg-[#0c1026] text-white placeholder:text-slate-600 rounded-2xl border border-white/10 focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/40 focus:outline-none transition-all text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label="Toggle password view"
                      className="absolute right-3.5 p-1 rounded-lg text-slate-400 hover:text-white transition"
                    >
                      <IconEye open={showPassword} />
                    </button>
                  </div>

                  {/* 4-Segment Strength Bar */}
                  <div className="mt-2.5 grid grid-cols-4 gap-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        score >= 1
                          ? score === 1
                            ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'
                            : score === 2
                            ? 'bg-amber-500'
                            : score === 3
                            ? 'bg-yellow-400'
                            : 'bg-[#44e2cd] shadow-[0_0_8px_#44e2cd]'
                          : 'bg-white/10'
                      }`}
                    />
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        score >= 2
                          ? score === 2
                            ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]'
                            : score === 3
                            ? 'bg-yellow-400'
                            : 'bg-[#44e2cd] shadow-[0_0_8px_#44e2cd]'
                          : 'bg-white/10'
                      }`}
                    />
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        score >= 3
                          ? score === 3
                            ? 'bg-yellow-400 shadow-[0_0_8px_#eab308]'
                            : 'bg-[#44e2cd] shadow-[0_0_8px_#44e2cd]'
                          : 'bg-white/10'
                      }`}
                    />
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        score >= 4
                          ? 'bg-[#44e2cd] shadow-[0_0_8px_#44e2cd]'
                          : 'bg-white/10'
                      }`}
                    />
                  </div>

                  {/* Live Validation Rules */}
                  <div className="mt-3.5 grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className={`flex items-center gap-1.5 transition-colors ${hasLength ? 'text-[#44e2cd]' : 'text-slate-500'}`}>
                      {hasLength ? <IconCheck /> : <IconCircle />}
                      <span>8+ characters</span>
                    </div>
                    <div className={`flex items-center gap-1.5 transition-colors ${hasUpper ? 'text-[#44e2cd]' : 'text-slate-500'}`}>
                      {hasUpper ? <IconCheck /> : <IconCircle />}
                      <span>At least one uppercase</span>
                    </div>
                    <div className={`flex items-center gap-1.5 transition-colors ${hasNumber ? 'text-[#44e2cd]' : 'text-slate-500'}`}>
                      {hasNumber ? <IconCheck /> : <IconCircle />}
                      <span>One number (0-9)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 transition-colors ${hasSymbol ? 'text-[#44e2cd]' : 'text-slate-500'}`}>
                      {hasSymbol ? <IconCheck /> : <IconCircle />}
                      <span>Special symbol (!@#$)</span>
                    </div>
                  </div>
                </div>

                {/* Submit Primary CTA */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 px-6 rounded-2xl font-bold text-white tracking-wider uppercase bg-gradient-to-r from-[#7c3aed] via-[#732ee4] to-[#44e2cd] shadow-lg shadow-[#7c3aed]/30 hover:shadow-[#7c3aed]/50 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Allocating Sovereign Node...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Free Account</span>
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>

                {/* Sign In Navigation */}
                <div className="text-center pt-2">
                  <p className="text-xs text-slate-400">
                    Already have an account?{' '}
                    <Link
                      to="/login"
                      className="text-[#d2bbff] hover:text-[#44e2cd] font-semibold transition-colors duration-200 ml-1 inline-flex items-center gap-1 hover:underline"
                    >
                      Sign in →
                    </Link>
                  </p>
                </div>

                {/* Fine Print Agreement */}
                <div className="pt-2 border-t border-white/10 text-center">
                  <p className="font-mono text-[10px] text-slate-500 leading-relaxed">
                    By creating an account, you agree to PerplexityCity{' '}
                    <a href="#" className="text-slate-400 hover:text-[#d2bbff] underline">
                      Terms of Synthesis
                    </a>{' '}
                    &amp;{' '}
                    <a href="#" className="text-slate-400 hover:text-[#d2bbff] underline">
                      Privacy Protocol
                    </a>
                    .
                  </p>
                </div>

              </form>
            </div>
          </section>

        </div>
      </main>

      {/* ── FOOTER (Stitch Aligned) ── */}
      <footer className="relative z-30 w-full border-t border-white/10 bg-[#0a0d1c]">
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

export default Register
