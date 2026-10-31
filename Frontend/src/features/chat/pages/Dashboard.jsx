import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import { useChat } from '../hooks/useChat'
import { useAuth } from '../../auth/hooks/useAuth'
import { setCurrentChatId } from '../chat.slice'

// ─── SVG Icons ──────────────────────────────────────────────────────────────────

const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
)

const IconMessage = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
  </svg>
)

const IconTrash = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
)

const IconLogout = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
)

const IconSend = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
  </svg>
)

const IconSparkle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5.5 h-5.5 shrink-0" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="sparkleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#20d9d2" />
        <stop offset="100%" stopColor="#1e90ff" />
      </linearGradient>
    </defs>
    <path stroke="url(#sparkleGrad)" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    <path stroke="url(#sparkleGrad)" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
      d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
  </svg>
)

const IconBot = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
    <circle cx="8" cy="16" r="0.5" fill="currentColor" />
    <circle cx="16" cy="16" r="0.5" fill="currentColor" />
  </svg>
)

const IconMenu = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

const IconClose = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)

// ─── Generating Indicator ─────────────────────────────────────────────────────

const GeneratingIndicator = () => (
  <div className="flex justify-start items-end gap-3">
    <div className="mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-400/30">
      <IconBot />
    </div>

    <div className="flex flex-col gap-2 rounded-2xl rounded-bl-sm px-5 py-4 bg-slate-900/95 border border-cyan-400/15 shadow-[0_0_20px_rgba(32,217,210,0.05)] min-w-[180px]">
      <span className="flex gap-1.5 items-center">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block h-2 w-2 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 animate-typing-bounce"
            style={{ animationDelay: `${i * 0.18}s` }}
          />
        ))}
        <span className="ml-1 text-xs font-medium text-cyan-400">Generating…</span>
      </span>
      <div className="flex flex-col gap-1.5 mt-1">
        {[80, 60, 40].map((w, i) => (
          <div
            key={i}
            className="h-2 rounded-full bg-white/6 animate-shimmer"
            style={{ width: `${w}%`, animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  </div>
)

// ─── Dashboard Component ──────────────────────────────────────────────────────

const Dashboard = () => {
  const chat = useChat()
  const dispatch = useDispatch()
  const { handelLogout } = useAuth()

  const [input, setInput] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(
    () => typeof window === 'undefined' || window.matchMedia('(min-width: 768px)').matches
  )
  const [logoutConfirm, setLogoutConfirm] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)

  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)
  const isLoading = useSelector((state) => state.chat.isLoading)
  const user = useSelector((state) => state.auth?.user)

  const messagesContainerRef = useRef(null)
  const textareaRef = useRef(null)
  const profileMenuRef = useRef(null)

  // Safe internal container scroll (never scrolls the window)
  const scrollToBottom = (smooth = true) => {
    const el = messagesContainerRef.current
    if (!el) return
    try {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      })
    } catch {
      el.scrollTop = el.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom(true)
  }, [chats, currentChatId, isLoading])

  useEffect(() => {
    chat.initializeSocketConnection()
    chat.handelGetChats()
  }, [])

  // Lock window scroll to 0,0 for mobile stability
  useEffect(() => {
    const lockWindow = () => {
      if (window.scrollY !== 0 || window.scrollX !== 0) {
        window.scrollTo(0, 0)
      }
    }
    window.addEventListener('scroll', lockWindow, { passive: true })
    return () => window.removeEventListener('scroll', lockWindow)
  }, [])

  useEffect(() => {
    const desktopMedia = window.matchMedia('(min-width: 768px)')
    const handleViewportChange = () => setSidebarOpen(desktopMedia.matches)

    desktopMedia.addEventListener('change', handleViewportChange)
    return () => desktopMedia.removeEventListener('change', handleViewportChange)
  }, [])

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setProfileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Auto-resize textarea
  const handleInputChange = (e) => {
    setInput(e.target.value)
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = Math.min(el.scrollHeight, 140) + 'px'
    }
  }

  const handleNewChat = () => {
    dispatch(setCurrentChatId(null))
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }

  const openChat = async (chatId) => {
    if (!chatId) return
    if (chatId !== currentChatId) {
      await chat.handelOpenChats(chats, chatId)
    }
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }

  const handleSendMessage = async () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    await chat.handelSendMessage({ message: trimmed, chatId: currentChatId })
    setTimeout(() => scrollToBottom(true), 50)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleLogout = async () => {
    if (!logoutConfirm) {
      setLogoutConfirm(true)
      setTimeout(() => setLogoutConfirm(false), 3000)
      return
    }
    await handelLogout()
  }

  const handleSuggestion = (text) => {
    setInput(text)
    textareaRef.current?.focus()
  }

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : 'U'

  const currentMessages = chats[currentChatId]?.messages || []
  const currentChatTitle = chats[currentChatId]?.title || 'New Conversation'

  const chatList = Object.values(chats).sort(
    (a, b) => new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0)
  )

  return (
    <main className="fixed inset-0 h-full w-full overflow-hidden bg-[#0d0e10] text-white flex flex-row font-sans">

      {/* ══════════════ SIDEBAR ══════════════ */}
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-50 md:z-auto h-full flex flex-col shrink-0 overflow-hidden bg-[#111215] border-r border-white/6 transition-all duration-300 ease-in-out ${
          sidebarOpen
            ? 'w-[min(86vw,310px)] md:w-68 opacity-100 shadow-[12px_0_36px_rgba(0,0,0,0.75)] md:shadow-none translate-x-0'
            : 'w-0 -translate-x-full md:translate-x-0 md:w-0 border-r-0'
        }`}
        aria-hidden={!sidebarOpen}
      >
        {/* Logo & Mobile Close */}
        <div className="flex items-center justify-between px-4.5 py-4 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-2.5">
            <IconSparkle />
            <span className="text-lg font-semibold tracking-tight whitespace-nowrap bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Perplexity
            </span>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="md:hidden flex h-7 w-7 items-center justify-center rounded-lg bg-white/6 text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close chat history"
          >
            <IconClose />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-4 pb-2 shrink-0">
          <button
            type="button"
            onClick={handleNewChat}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-sm font-medium text-white/85 bg-gradient-to-r from-cyan-400/8 to-blue-500/8 border border-cyan-400/20 hover:border-cyan-400/45 hover:bg-cyan-400/15 hover:shadow-[0_0_20px_rgba(32,217,210,0.1)] transition-all cursor-pointer whitespace-nowrap"
          >
            <IconPlus />
            New Conversation
          </button>
        </div>

        {/* Section Label */}
        <div className="px-5 py-1.5 flex items-center justify-between shrink-0">
          <span className="text-[10px] font-semibold tracking-wider text-white/30 uppercase">
            Chat History
          </span>
          <span className="text-[10px] text-cyan-400/70 font-semibold font-mono">
            {chatList.length}
          </span>
        </div>

        {/* Chat List */}
        <div className="custom-scrollbar flex-1 overflow-y-auto px-3 py-1 flex flex-col gap-0.5">
          {chatList.length === 0 ? (
            <div className="py-8 px-2 text-center text-xs text-white/25 leading-relaxed">
              No conversations yet.<br />Start chatting below.
            </div>
          ) : (
            chatList.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => openChat(c.id)}
                className={`group flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[13px] transition-all cursor-pointer relative animate-side-slide ${
                  currentChatId === c.id
                    ? 'bg-gradient-to-r from-cyan-400/10 to-blue-500/5 text-white border-l-[2.5px] border-cyan-400'
                    : 'text-white/50 border-l-[2.5px] border-transparent hover:bg-white/4 hover:text-white/80'
                }`}
              >
                <span className={`shrink-0 ${currentChatId === c.id ? 'text-cyan-400' : 'text-white/25 group-hover:text-white/50'}`}>
                  <IconMessage />
                </span>
                <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{c.title}</span>
                <span
                  className="opacity-0 group-hover:opacity-100 shrink-0 rounded-md p-1 text-white/20 hover:text-rose-400 hover:bg-rose-500/15 transition-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  <IconTrash />
                </span>
              </button>
            ))
          )}
        </div>

        {/* User Profile Box inside Sidebar */}
        <div className="border-t border-white/6 p-3.5 shrink-0 bg-[#111215]/90">
          <div className="flex items-center gap-2.5 rounded-xl p-2 bg-white/2">
            <div className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white bg-gradient-to-br from-cyan-400 to-blue-500 animate-pulse-glow">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-medium text-white/85">
                {user?.username || user?.email?.split('@')[0] || 'User'}
              </div>
              {user?.email && (
                <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[10px] text-white/35 font-mono">
                  {user.email}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title={logoutConfirm ? 'Click again to confirm' : 'Logout'}
              className={`flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-lg transition-all cursor-pointer ${
                logoutConfirm
                  ? 'text-rose-400 bg-rose-500/15 border border-rose-500/30'
                  : 'text-white/35 hover:text-rose-400 hover:bg-rose-500/10'
              }`}
            >
              <IconLogout />
            </button>
          </div>
          {logoutConfirm && (
            <p className="mt-1.5 text-center text-[10px] text-rose-400/85">
              Click again to confirm logout
            </p>
          )}
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-45 md:hidden bg-black/65 backdrop-blur-xs border-0 cursor-pointer"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ══════════════ MAIN CHAT AREA ══════════════ */}
      <section className="flex-1 min-w-0 h-full flex flex-col bg-[#0d0e10] overflow-hidden relative">

        {/* ── Top Bar ── */}
        <div className="sticky top-0 z-25 flex h-13 shrink-0 items-center gap-2.5 px-3 sm:px-4 bg-[#0d0e10]/95 backdrop-blur-xl border-b border-white/6">
          {/* Left: History & New Chat */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setSidebarOpen((v) => !v)}
              className={`flex h-8 items-center justify-center gap-1.5 px-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                sidebarOpen
                  ? 'text-cyan-400 bg-cyan-400/10 border border-cyan-400/30'
                  : 'text-white/70 bg-white/5 border border-white/8 hover:bg-white/10'
              }`}
              title="Chat History"
            >
              <IconMenu />
              <span className="hidden sm:inline">History</span>
              {chatList.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/8 text-white/70 font-semibold font-mono">
                  {chatList.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={handleNewChat}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/75 bg-white/5 border border-white/8 hover:bg-white/10 transition-all cursor-pointer"
              title="New Chat"
            >
              <IconPlus />
            </button>
          </div>

          <div className="w-px h-4.5 bg-white/8 shrink-0" />

          {/* Title */}
          <h2 className="flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium text-white/65 m-0">
            {currentChatId ? currentChatTitle : 'Perplexity AI'}
          </h2>

          {/* Right Controls */}
          <div className="flex items-center gap-2 shrink-0 relative" ref={profileMenuRef}>
            {isLoading && (
              <div className="flex items-center gap-1.5">
                <span className="block h-1.5 w-1.5 rounded-full bg-cyan-400 animate-typing-bounce" />
                <span className="hidden sm:inline text-xs text-cyan-400/85 font-medium">Generating…</span>
              </div>
            )}

            {/* Profile Avatar Button */}
            <button
              type="button"
              onClick={() => setProfileMenuOpen((v) => !v)}
              className={`flex h-8.5 w-8.5 items-center justify-center rounded-full p-0.5 transition-all cursor-pointer ${
                profileMenuOpen
                  ? 'bg-gradient-to-br from-cyan-400 to-blue-500 shadow-[0_0_12px_rgba(32,217,210,0.45)]'
                  : 'bg-gradient-to-br from-cyan-400/40 to-blue-500/40 hover:from-cyan-400/70 hover:to-blue-500/70'
              }`}
              title={user?.username || user?.email || 'Profile'}
            >
              <div className="w-full h-full rounded-full bg-[#0d0e10] flex items-center justify-center text-xs font-bold text-cyan-400">
                {initials}
              </div>
            </button>

            {/* Profile Dropdown */}
            {profileMenuOpen && (
              <div className="absolute top-11 right-0 w-[min(92vw,270px)] bg-[#15171d] border border-white/12 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_20px_rgba(32,217,210,0.1)] backdrop-blur-2xl z-50 animate-msg-fade">
                <div className="flex items-center gap-3 mb-3.5">
                  <div className="w-9.5 h-9.5 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-sm font-bold text-white shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-white overflow-hidden text-ellipsis whitespace-nowrap">
                      {user?.username || user?.email?.split('@')[0] || 'User'}
                    </div>
                    {user?.email && (
                      <div className="text-[11px] text-white/45 overflow-hidden text-ellipsis whitespace-nowrap font-mono">
                        {user.email}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-400/8 border border-cyan-400/20 text-[11px] text-cyan-400 font-medium mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
                  <span>Neural Node • Online</span>
                </div>

                <div className="border-t border-white/8 pt-2.5 flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false)
                      setSidebarOpen(true)
                    }}
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-white/85 hover:bg-white/6 transition-colors text-left w-full cursor-pointer"
                  >
                    <IconMessage />
                    <span>Chat History ({chatList.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false)
                      handleNewChat()
                    }}
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-white/85 hover:bg-white/6 transition-colors text-left w-full cursor-pointer"
                  >
                    <IconPlus />
                    <span>New Chat</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-all text-left w-full cursor-pointer mt-1 ${
                      logoutConfirm
                        ? 'text-rose-400 bg-rose-500/15 border border-rose-500/30'
                        : 'text-rose-400/85 hover:bg-rose-500/10'
                    }`}
                  >
                    <IconLogout />
                    <span>{logoutConfirm ? 'Confirm Logout?' : 'Sign Out'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Messages Container ── */}
        <div
          ref={messagesContainerRef}
          className="custom-scrollbar flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 sm:p-6 overscroll-contain"
        >
          {!currentChatId || currentMessages.length === 0 ? (
            /* Empty / Welcome State */
            <div className="flex min-h-full flex-col items-center justify-center gap-6 text-center select-none py-8">
              <div className="flex h-18 w-18 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400/12 to-blue-500/12 border border-cyan-400/20 shadow-[0_0_40px_rgba(32,217,210,0.08)]">
                <IconSparkle />
              </div>

              <div className="px-1">
                <h3 className="text-2xl sm:text-3xl font-bold text-white/85 mb-2 tracking-tight">
                  How can I help you today?
                </h3>
                <p className="text-sm text-white/30">
                  Ask anything — powered by AI
                </p>
              </div>

              {/* Suggestion Chips */}
              <div className="flex flex-wrap justify-center gap-2.5 max-w-xl w-full">
                {[
                  '✨ Explain quantum computing',
                  '⚛️ Write a React hook',
                  '📝 Summarize an article',
                  '🐛 Debug my JavaScript',
                  '🔗 Best practices for REST APIs',
                  '🧠 Teach me machine learning',
                ].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleSuggestion(s.slice(3))}
                    className="rounded-full px-4.5 py-2 text-xs sm:text-sm font-medium text-white/45 border border-white/8 bg-white/2 hover:border-cyan-400/35 hover:bg-cyan-400/6 hover:text-white/85 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(32,217,210,0.08)] transition-all cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Message Thread */
            <div className="mx-auto max-w-3xl flex flex-col gap-5">
              {currentMessages.map((message, index) => {
                const isUser = message.role === 'user'
                return (
                  <div
                    key={`${message.role}-${index}`}
                    className={`flex items-end gap-3 animate-msg-fade ${
                      isUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {/* Bot Avatar */}
                    {!isUser && (
                      <div className="mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-400/25">
                        <IconBot />
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`max-w-[90%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed break-words ${
                        isUser
                          ? 'rounded-br-sm bg-gradient-to-br from-[#1a5fad] to-[#1e90ff] text-white shadow-md'
                          : 'rounded-bl-sm bg-[#14151a]/95 border border-white/7 text-white/85 shadow-sm'
                      }`}
                    >
                      {isUser ? (
                        <p className="m-0">{message.content}</p>
                      ) : (
                        <div className="space-y-2">
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <p className="text-white/85 mb-2 last:mb-0">{children}</p>,
                              ul: ({ children }) => <ul className="text-white/80 list-disc pl-5 mb-2 space-y-1">{children}</ul>,
                              ol: ({ children }) => <ol className="text-white/80 list-decimal pl-5 mb-2 space-y-1">{children}</ol>,
                              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                              strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                              em: ({ children }) => <em className="text-white/65 italic">{children}</em>,
                              h1: ({ children }) => <h1 className="text-lg font-bold text-white mt-3 mb-1.5">{children}</h1>,
                              h2: ({ children }) => <h2 className="text-base font-semibold text-white mt-2.5 mb-1">{children}</h2>,
                              h3: ({ children }) => <h3 className="text-sm font-semibold text-white mt-2 mb-1">{children}</h3>,
                              code: ({ children, className }) =>
                                className ? (
                                  <code className="block rounded-lg bg-black/40 p-3 font-mono text-xs text-cyan-400 overflow-x-auto my-2 border border-white/5">
                                    {children}
                                  </code>
                                ) : (
                                  <code className="rounded bg-white/8 px-1.5 py-0.5 font-mono text-xs text-cyan-400">
                                    {children}
                                  </code>
                                ),
                              pre: ({ children }) => (
                                <pre className="overflow-x-auto rounded-xl p-3.5 text-xs bg-black/35 border border-white/7 my-2">
                                  {children}
                                </pre>
                              ),
                              a: ({ href, children }) => (
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-cyan-400 underline underline-offset-3 decoration-cyan-400/40 hover:text-cyan-300"
                                >
                                  {children}
                                </a>
                              ),
                              blockquote: ({ children }) => (
                                <blockquote className="my-2 border-l-2 border-cyan-400/40 pl-3.5 italic text-white/55">
                                  {children}
                                </blockquote>
                              ),
                              hr: () => <hr className="my-3.5 border-white/10" />,
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>

                    {/* User Avatar */}
                    {isUser && (
                      <div className="mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white bg-gradient-to-br from-cyan-400 to-blue-500 shadow-sm">
                        {initials}
                      </div>
                    )}
                  </div>
                )
              })}

              {isLoading && <GeneratingIndicator />}
            </div>
          )}
        </div>

        {/* ── Input Bar (Pinned at Bottom) ── */}
        <div className="shrink-0 p-3 sm:p-4 border-t border-white/6 bg-[#0d0e10]/98 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-end gap-2.5 rounded-2xl p-3 bg-white/[0.03] backdrop-blur-xl border border-white/10 transition-all focus-within:border-cyan-400/45 focus-within:shadow-[0_0_0_1px_rgba(32,217,210,0.2),0_8px_32px_rgba(32,217,210,0.08)]">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Ask anything…"
                disabled={isLoading}
                className="flex-1 resize-none bg-transparent text-sm text-white/90 placeholder:text-white/35 outline-none leading-relaxed max-h-32 min-h-[26px] disabled:opacity-45"
              />

              <button
                type="button"
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white transition-all cursor-pointer ${
                  input.trim() && !isLoading
                    ? 'bg-gradient-to-br from-cyan-400 to-blue-500 hover:opacity-90 hover:shadow-[0_0_20px_rgba(32,217,210,0.55)] active:scale-95'
                    : 'bg-white/5 text-white/30 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/15 border-t-white rounded-full animate-spin" />
                ) : (
                  <IconSend />
                )}
              </button>
            </div>

            <p className="hidden sm:block mt-2 text-center text-[10px] text-white/20 select-none">
              <kbd className="rounded px-1.5 py-0.5 bg-white/5 font-mono text-[9px] text-white/30">Enter</kbd> to send
              &nbsp;·&nbsp;
              <kbd className="rounded px-1.5 py-0.5 bg-white/5 font-mono text-[9px] text-white/30">Shift+Enter</kbd> for new line
            </p>
          </div>
        </div>

      </section>
    </main>
  )
}

export default Dashboard
