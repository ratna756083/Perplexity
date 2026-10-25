import React from 'react'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

const Register = () => {
  const [username, setusername] = useState('')
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [message, setMessage] = useState('')
  const [isErrorMessage, setIsErrorMessage] = useState(false)
  const {handelRegister} =useAuth()

async  function handelSubmit(e){
    e.preventDefault()
    setMessage('')
    setIsErrorMessage(false)
    const registration=await handelRegister({username,email,password})
    if(registration?.user){
      setMessage('Please verify your gmail')
    } else if(registration?.success === false && registration.message){
      setMessage(registration.message)
      setIsErrorMessage(true)
    }

  }
  return (
    <div className="min-h-screen overflow-x-hidden overflow-y-auto bg-[#050816] text-slate-100">
      <div className="relative flex min-h-screen items-center justify-center px-6 py-10">
        <section className="w-full max-w-[460px]">
          <div className="rounded-[2rem] border border-white/15 bg-white/[0.055] p-9 shadow-[0_30px_90px_rgba(0,0,0,0.7)] backdrop-blur-2xl">
            <div className="flex items-center justify-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-violet-500/20">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="#c8f8ff" strokeWidth="2" />
                  <path d="M3 20a9 9 0 0 1 18 0" stroke="#c8f8ff" strokeWidth="2" />
                  <path d="M18 3l3 3-3 3" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <div className="text-center">
                <h2 className="text-3xl font-black text-white">Create Account</h2>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Begin your PerplexCity journey</p>
              </div>
            </div>

            {message && (
              <p role={isErrorMessage ? 'alert' : 'status'} className={`mt-6 rounded-xl border px-4 py-3 text-center text-sm font-semibold ${isErrorMessage ? 'border-rose-400/30 bg-rose-400/10 text-rose-200' : 'border-teal-400/30 bg-teal-400/10 text-teal-200'}`}>
                {message}
              </p>
            )}

            <form onSubmit={handelSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.20em] text-slate-300" htmlFor="username">
                  Username
                </label>
                <input value={username} onChange={(e)=>{
                  setusername(e.target.value)
                }} id="username" type="text" placeholder="perplexcity_user" className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none transition duration-300 placeholder:text-slate-500 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/40" />
              </div>

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
                }} id="password" type="password" placeholder="Create a password" className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none transition duration-300 placeholder:text-slate-500 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/40" />
              </div>

              <button type="submit" className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-teal-400 px-4 py-3 text-sm font-black uppercase tracking-[0.25em] text-white shadow-lg shadow-violet-700/40 transition hover:scale-[1.02] hover:shadow-teal-400/30">
                Create Free Account
              </button>
            </form>

            <div className="my-7 flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
              <span className="h-px flex-1 bg-white/10" /> join with <span className="h-px flex-1 bg-white/10" />
            </div>

            <div className="flex justify-center gap-4">
              <button className="grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-transparent text-sm font-black text-white transition hover:bg-white/10">G</button>
              <button className="grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-transparent text-sm font-black text-white transition hover:bg-white/10">◎</button>
              <button className="grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-transparent text-sm font-black text-white transition hover:bg-white/10">✕</button>
            </div>

            <div className="mt-7 text-center text-xs font-semibold text-slate-400">
              Already have an account? <a href="/login" className="font-black text-sky-300 hover:text-sky-200">Sign in</a>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Register