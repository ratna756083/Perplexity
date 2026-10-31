import React, { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router'
import { useSelector } from 'react-redux'
import { useAuth } from '../hooks/useAuth'

const GoogleLogo = () => (
  <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24">
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

const IconEye = ({ open }) => (
  open ? (
    <svg className="w-4 h-4 text-slate-400 hover:text-slate-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg className="w-4 h-4 text-slate-400 hover:text-slate-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
)

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

  if (!loading && user) {
    return <Navigate to="/" />
  }

  const handleGoogleAuth = () => {
    window.location.href = 'https://perplexity-wbhi.onrender.com/api/auth/google'
  }

  async function handelSubmit(e) {
    e.preventDefault()
    setLocalError('')

    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()

    if (!trimmedEmail || !trimmedPassword) {
      setLocalError('Please enter both email and password.')
      return
    }

    const res = await handelLogin({ email: trimmedEmail, password: trimmedPassword })
    if (res?.user) {
      navigate('/')
    } else if (res?.message) {
      setLocalError(res.message)
    } else {
      setLocalError('Invalid email or password. Please try again.')
    }
  }

  const displayError = localError || authError

  return (
    <div className="min-h-screen bg-[#0e0f12] text-slate-100 flex flex-col justify-center items-center px-4 py-10 font-sans">
      <div className="w-full max-w-md">

        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <span className="text-xl font-bold tracking-tight text-white">
              Perplexity
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back</h1>
          <p className="text-xs text-slate-400 mt-1">Sign in to continue your conversations</p>
        </div>

        {/* Auth Card */}
        <div className="bg-[#16171b] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/40">

          {/* Invalid User / Error Alert */}
          {displayError && (
            <div
              role="alert"
              className="mb-4 px-3.5 py-2.5 rounded-xl text-xs font-medium bg-rose-500/10 border border-rose-500/25 text-rose-300 flex items-center gap-2"
            >
              <svg className="w-4 h-4 shrink-0 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{displayError}</span>
            </div>
          )}

          {/* Credentials Form */}
          <form onSubmit={handelSubmit} className="space-y-4" noValidate>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-slate-300 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setemail(e.target.value)
                  if (localError) setLocalError('')
                }}
                placeholder="you@example.com"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f1013] border border-white/10 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-medium text-slate-300">
                  Password
                </label>
                <a href="#" className="text-xs text-cyan-400 hover:underline">
                  Forgot password?
                </a>
              </div>

              <div className="relative flex items-center">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setpassword(e.target.value)
                    if (localError) setLocalError('')
                  }}
                  placeholder="••••••••"
                  required
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-[#0f1013] border border-white/10 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 p-1 cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  <IconEye open={showPassword} />
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 pt-0.5">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-[#0f1013] border-white/20 text-cyan-500 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs text-slate-400 cursor-pointer select-none">
                Remember me
              </label>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Google Sign-in Placed at the Last */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-medium text-sm transition-colors cursor-pointer"
          >
            <GoogleLogo />
            <span>Continue with Google</span>
          </button>

          {/* Footer Link */}
          <div className="mt-5 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-cyan-400 hover:underline font-medium">
              Create account
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Login
