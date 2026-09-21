import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router'
import { Navigate } from 'react-router'
import { useSelector } from 'react-redux'
const Login = () => {
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const { handelLogin}=useAuth()
  const navigate=useNavigate()
  const user=useSelector(state=>state.auth.user)
  const loading=useSelector(state=>state.auth.loading)

 async function handelSubmit(e){
    e.preventDefault()
    await handelLogin({email,password})
    navigate("/")

  }

  if(!loading && user){
   return  <Navigate to="/" />
  }
  

  return (
    <div className="min-h-screen overflow-x-hidden overflow-y-auto bg-[#050816] text-slate-100">
      <div className="relative flex min-h-screen items-center justify-center px-6 py-10">
        <section className="w-full max-w-[460px]">
          <div className="rounded-[2rem] border border-white/15 bg-white/[0.055] p-9 shadow-[0_30px_90px_rgba(0,0,0,0.7)] backdrop-blur-2xl">
            <div className="flex items-center justify-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-violet-500/20">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path d="M10 17l5-5-5-5" stroke="#c8f8ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15 12H3" stroke="#c8f8ff" strokeWidth="2" strokeLinecap="round" />
                  <path d="M13 3h8v18h-8" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <div className="text-center">
                <h2 className="text-3xl font-black text-white">Sign In</h2>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Welcome to PerplexCity</p>
              </div>
            </div>

            <form onSubmit={handelSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.20em] text-slate-300" htmlFor="email">
                  Email
                </label>
                <input value={email} onChange={(e)=>{
                  setemail(e.target.value)
                }} id="email" type="email" placeholder="you@example.com" className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none transition duration-300 placeholder:text-slate-500 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/40" />
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.20em] text-slate-300" htmlFor="password">
                  Password
                </label>
                <input value={password} onChange={(e)=>{
                  setpassword(e.target.value)
                }} id="password" type="password" placeholder="••••••••" className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none transition duration-300 placeholder:text-slate-500 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/40" />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-400">
                  <input type="checkbox" className="h-4 w-4 accent-violet-500" /> Remember me
                </label>
                <a href="#" className="text-xs font-bold text-sky-300 hover:text-sky-200">Forgot password?</a>
              </div>

              <button type="submit" className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-teal-400 px-4 py-3 text-sm font-black uppercase tracking-[0.25em] text-white shadow-lg shadow-violet-700/40 transition hover:scale-[1.02] hover:shadow-teal-400/30">
                Sign In
              </button>
            </form>

            <div className="my-7 flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
              <span className="h-px flex-1 bg-white/10" /> or continue with <span className="h-px flex-1 bg-white/10" />
            </div>

            <div className="flex justify-center gap-4">
              <button className="grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-transparent text-sm font-black text-white transition hover:bg-white/10">G</button>
              <button className="grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-transparent text-sm font-black text-white transition hover:bg-white/10">◎</button>
              <button className="grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-transparent text-sm font-black text-white transition hover:bg-white/10">✕</button>
            </div>

            <div className="mt-7 text-center text-xs font-semibold text-slate-400">
              New to PerplexCity? <a href="/register" className="font-black text-sky-300 hover:text-sky-200">Create account</a>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Login
