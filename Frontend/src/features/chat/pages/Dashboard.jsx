import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import { useChat } from '../hooks/useChat'
import { useAuth } from '../../auth/hooks/useAuth'
import { setCurrentChatId } from '../chat.slice'

// ─── Inline SVG Icons ──────────────────────────────────────────────────────────

const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
)

const IconMessage = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
  </svg>
)

const IconTrash = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
)

const IconLogout = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
)

const IconSend = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
  </svg>
)

const IconSparkle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none">
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
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
    <circle cx="8" cy="16" r="0.5" fill="currentColor" />
    <circle cx="16" cy="16" r="0.5" fill="currentColor" />
  </svg>
)

const IconMenu = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

const IconClose = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)

// ─── Generating / Typing indicator ────────────────────────────────────────────
const GeneratingIndicator = () => (
  <div className="flex justify-start items-end gap-3">
    <div
      className="mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
      style={{
        background: 'linear-gradient(135deg, rgba(32,217,210,0.2), rgba(30,144,255,0.2))',
        border: '1px solid rgba(32,217,210,0.3)',
      }}
    >
      <span style={{ color: '#20d9d2' }}><IconBot /></span>
    </div>

    <div
      className="flex flex-col gap-2 rounded-2xl rounded-bl-sm px-5 py-4"
      style={{
        background: 'rgba(22,23,28,0.95)',
        border: '1px solid rgba(32,217,210,0.15)',
        boxShadow: '0 0 20px rgba(32,217,210,0.05)',
        minWidth: '180px',
      }}
    >
      <span className="flex gap-1.5 items-center">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block h-2 w-2 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #20d9d2, #1e90ff)',
              animation: `typingBounce 1.2s ease-in-out infinite`,
              animationDelay: `${i * 0.18}s`,
            }}
          />
        ))}
        <span className="ml-1 text-xs font-medium" style={{ color: '#20d9d2' }}>Generating…</span>
      </span>
      <div className="flex flex-col gap-1.5 mt-1">
        {[80, 60, 40].map((w, i) => (
          <div
            key={i}
            className="h-2 rounded-full"
            style={{
              width: `${w}%`,
              background: 'rgba(255,255,255,0.06)',
              animation: `shimmer 1.6s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  </div>
)

// ─── Dashboard ──────────────────────────────────────────────────────────────────
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

  // Safe inner container scroll (never scrolls the entire window or hides the header)
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

  // Lock window scroll to 0,0 so mobile browsers never stick or scroll the header off-screen
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
    // Ensure scroll immediately updates
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
    <>
      {/* Global styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        html, body, #root {
          height: 100%;
          width: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
          position: fixed;
          inset: 0;
          touch-action: manipulation;
        }

        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        @keyframes msgFadeSlide {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes sideSlide {
          from { opacity: 0; transform: translateX(-6px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes spinAnim {
          to { transform: rotate(360deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(32,217,210,0.3); }
          50% { box-shadow: 0 0 0 6px rgba(32,217,210,0); }
        }

        .msg-animate { animation: msgFadeSlide 0.3s cubic-bezier(0.16,1,0.3,1) forwards; }
        .sidebar-animate { animation: sideSlide 0.22s ease forwards; }

        /* Custom scrollbar */
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.16); }

        /* Glass input */
        .glass-input-box {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          transition: border-color 0.25s, box-shadow 0.25s;
        }
        .glass-input-box:focus-within {
          border-color: rgba(32,217,210,0.45) !important;
          box-shadow: 0 0 0 1px rgba(32,217,210,0.2), 0 8px 32px rgba(32,217,210,0.08);
        }

        .send-btn-active {
          background: linear-gradient(135deg, #20d9d2, #1e90ff);
          transition: all 0.2s;
        }
        .send-btn-active:hover {
          opacity: 0.9;
          box-shadow: 0 0 20px rgba(32,217,210,0.55);
          transform: scale(1.04);
        }

        .new-chat-btn {
          background: linear-gradient(135deg, rgba(32,217,210,0.08), rgba(30,144,255,0.08));
          border: 1px solid rgba(32,217,210,0.22);
          transition: all 0.2s;
        }
        .new-chat-btn:hover {
          background: linear-gradient(135deg, rgba(32,217,210,0.15), rgba(30,144,255,0.15));
          border-color: rgba(32,217,210,0.45);
          box-shadow: 0 0 20px rgba(32,217,210,0.1);
        }

        .chat-item { transition: all 0.15s ease; }
        .chat-item:hover .trash-icon { opacity: 1 !important; }
        .trash-icon { opacity: 0; transition: opacity 0.2s; }

        .active-chat-item {
          background: linear-gradient(90deg, rgba(32,217,210,0.1) 0%, rgba(30,144,255,0.06) 100%);
          border-left: 2.5px solid #20d9d2 !important;
        }

        .gradient-title {
          background: linear-gradient(135deg, #20d9d2 0%, #1e90ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .user-msg-bubble {
          background: linear-gradient(135deg, #1a5fad, #1e90ff);
        }

        .ai-msg-card {
          background: rgba(20,21,26,0.97);
          border: 1px solid rgba(255,255,255,0.07);
        }

        .spinner {
          border: 2px solid rgba(255,255,255,0.15);
          border-top-color: #fff;
          border-radius: 50%;
          width: 14px;
          height: 14px;
          animation: spinAnim 0.65s linear infinite;
        }

        .suggestion-chip {
          transition: all 0.2s;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.02);
          cursor: pointer;
        }
        .suggestion-chip:hover {
          border-color: rgba(32,217,210,0.35);
          background: rgba(32,217,210,0.06);
          color: rgba(255,255,255,0.85);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(32,217,210,0.08);
        }

        /* Markdown prose */
        .prose-ai p { margin-bottom: 0.6rem; }
        .prose-ai p:last-child { margin-bottom: 0; }
        .prose-ai ul, .prose-ai ol { margin-bottom: 0.6rem; padding-left: 1.4rem; }
        .prose-ai li { margin-bottom: 0.25rem; line-height: 1.7; }
        .prose-ai h1, .prose-ai h2, .prose-ai h3 { margin-top: 0.8rem; margin-bottom: 0.4rem; color: #fff; }
        .prose-ai pre { margin-bottom: 0.8rem; }
        .prose-ai blockquote { margin: 0.5rem 0; }

        .dashboard-backdrop { display: none; }
        .history-btn-text { display: inline; }
        .generating-text { display: inline; }

        @media (max-width: 767px) {
          .dashboard-sidebar {
            position: fixed;
            inset: 0 auto 0 0;
            z-index: 50;
            height: 100%;
            height: 100dvh;
            box-shadow: 12px 0 36px rgba(0,0,0,0.75);
            transition: transform 0.3s cubic-bezier(0.4,0,0.2,1), width 0.3s cubic-bezier(0.4,0,0.2,1);
          }
          .dashboard-sidebar.is-open {
            width: min(86vw, 310px) !important;
            min-width: min(86vw, 310px) !important;
            transform: translateX(0);
          }
          .dashboard-sidebar.is-closed {
            width: 0 !important;
            min-width: 0 !important;
            transform: translateX(-100%);
            border-right: 0 !important;
            box-shadow: none;
          }
          .dashboard-backdrop {
            position: fixed;
            inset: 0;
            z-index: 45;
            display: block;
            border: 0;
            background: rgba(0,0,0,0.65);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
          }
          .dashboard-header {
            padding: 0 12px !important;
            gap: 8px !important;
            height: 52px !important;
            position: sticky !important;
            top: 0 !important;
            z-index: 25 !important;
          }
          .dashboard-messages {
            padding: 16px 12px 12px !important;
            overscroll-behavior-y: contain;
          }
          .welcome-content { padding: 0 4px; }
          .welcome-title { font-size: clamp(1.2rem, 5vw, 1.5rem) !important; }
          .suggestion-list { width: 100%; gap: 8px !important; }
          .suggestion-chip { max-width: 100%; padding: 8px 12px !important; font-size: 0.75rem !important; }
          .message-bubble { max-width: 90% !important; padding: 10px 14px !important; font-size: 0.86rem !important; }
          .dashboard-composer { padding: 10px 12px calc(12px + env(safe-area-inset-bottom, 0px)) !important; }
          .composer-box { gap: 8px !important; padding: 10px 12px !important; }
          .composer-input { min-width: 0; font-size: 16px !important; }
          .input-hint { display: none; }
          .generating-text { display: none; }
        }

        @media (max-width: 480px) {
          .history-btn-text { display: none; }
          .profile-dropdown-menu { width: min(92vw, 270px) !important; right: 0px !important; }
        }
      `}</style>

      <main
        style={{
          position: 'fixed',
          inset: 0,
          height: '100%',
          width: '100%',
          overflow: 'hidden',
          background: '#0d0e10',
          color: '#fff',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        {/* ══════════════ SIDEBAR (Chat History & Profile Drawer) ══════════════ */}
        <aside
          className={`dashboard-sidebar ${sidebarOpen ? 'is-open' : 'is-closed'}`}
          aria-hidden={!sidebarOpen}
          style={{
            width: sidebarOpen ? '272px' : '0px',
            minWidth: sidebarOpen ? '272px' : '0px',
            background: '#111215',
            borderRight: '1px solid rgba(255,255,255,0.06)',
            transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1), min-width 0.3s cubic-bezier(0.4,0,0.2,1)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            flexShrink: 0,
            height: '100%',
          }}
        >
          {/* ── Logo & Mobile Close ── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 18px',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <IconSparkle />
              <span className="gradient-title" style={{ fontSize: '1.15rem', fontWeight: 600, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                Perplexity
              </span>
            </div>

            {/* Mobile close drawer button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="md:hidden"
              aria-label="Close chat history"
              style={{
                display: 'flex',
                height: '28px',
                width: '28px',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.6)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <IconClose />
            </button>
          </div>

          {/* ── New Chat Action ── */}
          <div style={{ padding: '14px 16px 8px', flexShrink: 0 }}>
            <button
              onClick={handleNewChat}
              className="new-chat-btn"
              style={{
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                borderRadius: '12px',
                padding: '10px 16px',
                fontSize: '0.85rem',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.85)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              <IconPlus />
              New Conversation
            </button>
          </div>

          {/* ── Section label ── */}
          <div style={{ padding: '6px 20px 4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
              Chat History
            </span>
            <span style={{ fontSize: '0.65rem', color: 'rgba(32,217,210,0.7)', fontWeight: 600 }}>
              {chatList.length}
            </span>
          </div>

          {/* ── Chat List ── */}
          <div className="custom-scroll" style={{ flex: 1, overflowY: 'auto', padding: '4px 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {chatList.length === 0 ? (
              <div style={{ padding: '32px 8px', textAlign: 'center', fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)', lineHeight: 1.6 }}>
                No conversations yet.<br />Start chatting below.
              </div>
            ) : (
              chatList.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => openChat(c.id)}
                  className={`chat-item sidebar-animate ${currentChatId === c.id ? 'active-chat-item' : ''}`}
                  style={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    gap: '10px',
                    borderRadius: '10px',
                    padding: '9px 12px',
                    textAlign: 'left',
                    fontSize: '0.82rem',
                    borderLeft: currentChatId === c.id ? undefined : '2.5px solid transparent',
                    color: currentChatId === c.id ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.5)',
                    background: currentChatId === c.id ? undefined : 'transparent',
                    cursor: 'pointer',
                    animationDelay: `${i * 15}ms`,
                    position: 'relative',
                  }}
                  onMouseEnter={e => { if (currentChatId !== c.id) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                  onMouseLeave={e => { if (currentChatId !== c.id) e.currentTarget.style.background = 'transparent' }}
                >
                  <span style={{ color: currentChatId === c.id ? '#20d9d2' : 'rgba(255,255,255,0.25)', flexShrink: 0 }}>
                    <IconMessage />
                  </span>
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</span>
                  <span
                    className="trash-icon"
                    style={{ flexShrink: 0, borderRadius: '6px', padding: '3px', color: 'rgba(255,255,255,0.2)' }}
                    onClick={(e) => e.stopPropagation()}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; e.currentTarget.style.color = '#f87171' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.2)' }}
                  >
                    <IconTrash />
                  </span>
                </button>
              ))
            )}
          </div>

          {/* ── User Profile & Logout (Inside Sidebar) ── */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '12px 14px', flexShrink: 0, background: 'rgba(17,18,21,0.9)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '12px', padding: '8px 10px', background: 'rgba(255,255,255,0.02)' }}>
              {/* Avatar */}
              <div
                style={{
                  display: 'flex',
                  height: '34px',
                  width: '34px',
                  flexShrink: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: '#fff',
                  background: 'linear-gradient(135deg, #20d9d2, #1e90ff)',
                  animation: 'pulseGlow 3s ease-in-out infinite',
                }}
              >
                {initials}
              </div>

              {/* Name + Email */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.83rem', fontWeight: 500, color: 'rgba(255,255,255,0.85)' }}>
                  {user?.username || user?.email?.split('@')[0] || 'User'}
                </div>
                {user?.email && (
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)' }}>{user.email}</div>
                )}
              </div>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                title={logoutConfirm ? 'Click again to confirm' : 'Logout'}
                style={{
                  display: 'flex',
                  height: '30px',
                  width: '30px',
                  flexShrink: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  transition: 'all 0.2s',
                  color: logoutConfirm ? '#f87171' : 'rgba(255,255,255,0.35)',
                  background: logoutConfirm ? 'rgba(239,68,68,0.15)' : 'transparent',
                  outline: logoutConfirm ? '1px solid rgba(239,68,68,0.3)' : 'none',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { if (!logoutConfirm) { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#f87171' }}}
                onMouseLeave={e => { if (!logoutConfirm) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)' }}}
              >
                <IconLogout />
              </button>
            </div>

            {logoutConfirm && (
              <p style={{ marginTop: '6px', textAlign: 'center', fontSize: '0.62rem', color: 'rgba(248,113,113,0.85)', lineHeight: 1.4 }}>
                Click again to confirm logout
              </p>
            )}
          </div>
        </aside>

        {/* Backdrop for mobile when sidebar is open */}
        {sidebarOpen && (
          <button
            type="button"
            className="dashboard-backdrop"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ══════════════ MAIN CHAT AREA (Pinned & Responsive) ══════════════ */}
        <section
          style={{
            flex: 1,
            minWidth: 0,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: '#0d0e10',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* ── Top Bar (Always Pinned & Never Scrolls Off) ── */}
          <div
            className="dashboard-header"
            style={{
              background: 'rgba(13,14,16,0.96)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              display: 'flex',
              height: '52px',
              flexShrink: 0,
              alignItems: 'center',
              gap: '10px',
              padding: '0 16px',
              position: 'relative',
              zIndex: 25,
            }}
          >
            {/* Left Controls: History Toggle & Quick New Chat */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
              <button
                onClick={() => setSidebarOpen((v) => !v)}
                aria-label={sidebarOpen ? 'Hide chat history' : 'Show chat history'}
                aria-expanded={sidebarOpen}
                style={{
                  display: 'flex',
                  height: '32px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '0 10px',
                  borderRadius: '8px',
                  color: sidebarOpen ? '#20d9d2' : 'rgba(255,255,255,0.7)',
                  background: sidebarOpen ? 'rgba(32,217,210,0.1)' : 'rgba(255,255,255,0.05)',
                  border: sidebarOpen ? '1px solid rgba(32,217,210,0.3)' : '1px solid rgba(255,255,255,0.08)',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  fontWeight: 500,
                }}
                title="Chat History"
              >
                <IconMenu />
                <span className="history-btn-text">History</span>
                {chatList.length > 0 && (
                  <span
                    style={{
                      fontSize: '0.62rem',
                      padding: '1px 5px',
                      borderRadius: '999px',
                      background: 'rgba(255,255,255,0.08)',
                      color: 'rgba(255,255,255,0.7)',
                      fontWeight: 600,
                    }}
                  >
                    {chatList.length}
                  </span>
                )}
              </button>

              <button
                onClick={handleNewChat}
                style={{
                  display: 'flex',
                  height: '32px',
                  width: '32px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  color: 'rgba(255,255,255,0.75)',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                title="New Chat"
              >
                <IconPlus />
              </button>
            </div>

            <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />

            {/* Title */}
            <h2
              style={{
                flex: 1,
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontSize: '0.85rem',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.65)',
                margin: 0,
              }}
            >
              {currentChatId ? currentChatTitle : 'Perplexity AI'}
            </h2>

            {/* Right Controls: Generating & Profile Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, position: 'relative' }} ref={profileMenuRef}>
              {isLoading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      display: 'block',
                      height: '6px',
                      width: '6px',
                      borderRadius: '50%',
                      background: '#20d9d2',
                      animation: 'typingBounce 1s ease-in-out infinite',
                    }}
                  />
                  <span style={{ fontSize: '0.7rem', color: 'rgba(32,217,210,0.85)', fontWeight: 500 }} className="generating-text">
                    Generating…
                  </span>
                </div>
              )}

              {/* Permanent Profile Button (Always visible on mobile & desktop) */}
              <button
                type="button"
                onClick={() => setProfileMenuOpen((v) => !v)}
                aria-label="User Profile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '34px',
                  width: '34px',
                  borderRadius: '50%',
                  padding: '2px',
                  background: profileMenuOpen
                    ? 'linear-gradient(135deg, #20d9d2, #1e90ff)'
                    : 'linear-gradient(135deg, rgba(32,217,210,0.4), rgba(30,144,255,0.4))',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: profileMenuOpen ? '0 0 12px rgba(32,217,210,0.45)' : 'none',
                }}
                title={user?.username || user?.email || 'Profile'}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: '#0d0e10',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#20d9d2',
                  }}
                >
                  {initials}
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {profileMenuOpen && (
                <div
                  className="profile-dropdown-menu"
                  style={{
                    position: 'absolute',
                    top: '44px',
                    right: '0px',
                    width: '260px',
                    background: '#15171d',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '16px',
                    padding: '16px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.7), 0 0 20px rgba(32,217,210,0.1)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    zIndex: 100,
                    animation: 'msgFadeSlide 0.2s cubic-bezier(0.16,1,0.3,1) forwards',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #20d9d2, #1e90ff)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: '#fff',
                        flexShrink: 0,
                      }}
                    >
                      {initials}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user?.username || user?.email?.split('@')[0] || 'User'}
                      </div>
                      {user?.email && (
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {user.email}
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      background: 'rgba(32,217,210,0.08)',
                      border: '1px solid rgba(32,217,210,0.2)',
                      fontSize: '0.72rem',
                      color: '#20d9d2',
                      fontWeight: 500,
                      marginBottom: '12px',
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#20d9d2', display: 'inline-block' }} />
                    <span>Neural Node • Online</span>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false)
                        setSidebarOpen(true)
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        color: 'rgba(255,255,255,0.85)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        width: '100%',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <IconMessage />
                      <span>Chat History ({chatList.length})</span>
                    </button>

                    <button
                      onClick={() => {
                        setProfileMenuOpen(false)
                        handleNewChat()
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        color: 'rgba(255,255,255,0.85)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        width: '100%',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <IconPlus />
                      <span>New Chat</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        color: logoutConfirm ? '#f87171' : 'rgba(248,113,113,0.85)',
                        background: logoutConfirm ? 'rgba(239,68,68,0.15)' : 'transparent',
                        border: logoutConfirm ? '1px solid rgba(239,68,68,0.3)' : 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        width: '100%',
                        marginTop: '4px',
                      }}
                    >
                      <IconLogout />
                      <span>{logoutConfirm ? 'Confirm Logout?' : 'Sign Out'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Messages Container (Only this scrolls; never scrolls window) ── */}
          <div
            ref={messagesContainerRef}
            className="custom-scroll dashboard-messages"
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              overflowX: 'hidden',
              padding: '24px 20px 16px',
            }}
          >
            {!currentChatId || currentMessages.length === 0 ? (
              /* ── Empty / Welcome State ── */
              <div
                style={{
                  display: 'flex',
                  minHeight: '100%',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '24px',
                  textAlign: 'center',
                  userSelect: 'none',
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    display: 'flex',
                    height: '72px',
                    width: '72px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '24px',
                    background: 'linear-gradient(135deg, rgba(32,217,210,0.12), rgba(30,144,255,0.12))',
                    border: '1px solid rgba(32,217,210,0.2)',
                    boxShadow: '0 0 40px rgba(32,217,210,0.08)',
                  }}
                >
                  <IconSparkle />
                </div>

                <div className="welcome-content">
                  <h3 className="welcome-title" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'rgba(255,255,255,0.85)', marginBottom: '8px', letterSpacing: '-0.02em' }}>
                    How can I help you today?
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.3)', lineHeight: 1.5 }}>
                    Ask anything — powered by AI
                  </p>
                </div>

                {/* Suggestion chips */}
                <div className="suggestion-list" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', maxWidth: '580px' }}>
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
                      onClick={() => handleSuggestion(s.slice(3))}
                      className="suggestion-chip"
                      style={{
                        borderRadius: '999px',
                        padding: '8px 18px',
                        fontSize: '0.8rem',
                        color: 'rgba(255,255,255,0.45)',
                        fontWeight: 500,
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* ── Message Thread ── */
              <div
                style={{
                  margin: '0 auto',
                  maxWidth: '800px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                }}
              >
                {currentMessages.map((message, index) => {
                  const isUser = message.role === 'user'
                  return (
                    <div
                      key={`${message.role}-${index}`}
                      className="msg-animate"
                      style={{
                        display: 'flex',
                        justifyContent: isUser ? 'flex-end' : 'flex-start',
                        alignItems: 'flex-end',
                        gap: '12px',
                        animationDelay: `${Math.min(index * 12, 150)}ms`,
                      }}
                    >
                      {/* AI avatar */}
                      {!isUser && (
                        <div
                          style={{
                            marginBottom: '2px',
                            display: 'flex',
                            height: '32px',
                            width: '32px',
                            flexShrink: 0,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, rgba(32,217,210,0.18), rgba(30,144,255,0.18))',
                            border: '1px solid rgba(32,217,210,0.25)',
                          }}
                        >
                          <span style={{ color: '#20d9d2' }}><IconBot /></span>
                        </div>
                      )}

                      {/* Bubble */}
                      <div
                        className={`message-bubble ${isUser ? 'user-msg-bubble' : 'ai-msg-card'}`}
                        style={{
                          maxWidth: '75%',
                          borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                          padding: '12px 18px',
                          fontSize: '0.9rem',
                          lineHeight: 1.7,
                          color: isUser ? '#fff' : 'rgba(255,255,255,0.85)',
                          wordBreak: 'break-word',
                        }}
                      >
                        {isUser ? (
                          <p style={{ margin: 0 }}>{message.content}</p>
                        ) : (
                          <div className="prose-ai">
                            <ReactMarkdown
                              components={{
                                p: ({ children }) => (
                                  <p style={{ color: 'rgba(255,255,255,0.85)' }}>{children}</p>
                                ),
                                ul: ({ children }) => (
                                  <ul style={{ color: 'rgba(255,255,255,0.78)' }}>{children}</ul>
                                ),
                                ol: ({ children }) => (
                                  <ol style={{ color: 'rgba(255,255,255,0.78)' }}>{children}</ol>
                                ),
                                li: ({ children }) => <li>{children}</li>,
                                strong: ({ children }) => (
                                  <strong style={{ color: '#fff', fontWeight: 600 }}>{children}</strong>
                                ),
                                em: ({ children }) => (
                                  <em style={{ color: 'rgba(255,255,255,0.65)', fontStyle: 'italic' }}>{children}</em>
                                ),
                                h1: ({ children }) => (
                                  <h1 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{children}</h1>
                                ),
                                h2: ({ children }) => (
                                  <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>{children}</h2>
                                ),
                                h3: ({ children }) => (
                                  <h3 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#fff' }}>{children}</h3>
                                ),
                                code: ({ children, className }) =>
                                  className ? (
                                    <code
                                      className={className}
                                      style={{
                                        display: 'block',
                                        borderRadius: '10px',
                                        background: 'rgba(0,0,0,0.4)',
                                        padding: '12px 16px',
                                        fontSize: '0.82em',
                                        fontFamily: 'monospace',
                                        color: '#20d9d2',
                                      }}
                                    >
                                      {children}
                                    </code>
                                  ) : (
                                    <code
                                      style={{
                                        borderRadius: '6px',
                                        background: 'rgba(255,255,255,0.08)',
                                        padding: '2px 7px',
                                        fontSize: '0.83em',
                                        fontFamily: 'monospace',
                                        color: '#20d9d2',
                                      }}
                                    >
                                      {children}
                                    </code>
                                  ),
                                pre: ({ children }) => (
                                  <pre
                                    style={{
                                      overflowX: 'auto',
                                      borderRadius: '12px',
                                      padding: '16px',
                                      fontSize: '0.85rem',
                                      background: 'rgba(0,0,0,0.35)',
                                      border: '1px solid rgba(255,255,255,0.07)',
                                    }}
                                  >
                                    {children}
                                  </pre>
                                ),
                                a: ({ href, children }) => (
                                  <a
                                    href={href}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                      color: '#20d9d2',
                                      textDecoration: 'underline',
                                      textDecorationColor: 'rgba(32,217,210,0.35)',
                                      textUnderlineOffset: '3px',
                                    }}
                                  >
                                    {children}
                                  </a>
                                ),
                                blockquote: ({ children }) => (
                                  <blockquote
                                    style={{
                                      margin: '8px 0',
                                      borderLeft: '2px solid rgba(32,217,210,0.4)',
                                      paddingLeft: '14px',
                                      color: 'rgba(255,255,255,0.55)',
                                      fontStyle: 'italic',
                                    }}
                                  >
                                    {children}
                                  </blockquote>
                                ),
                                hr: () => (
                                  <hr style={{ margin: '14px 0', borderColor: 'rgba(255,255,255,0.1)' }} />
                                ),
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>

                      {/* User avatar dot */}
                      {isUser && (
                        <div
                          style={{
                            marginBottom: '2px',
                            display: 'flex',
                            height: '32px',
                            width: '32px',
                            flexShrink: 0,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50%',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            color: '#fff',
                            background: 'linear-gradient(135deg, #20d9d2, #1e90ff)',
                          }}
                        >
                          {initials}
                        </div>
                      )}
                    </div>
                  )
                })}

                {/* ✅ Generating indicator */}
                {isLoading && <GeneratingIndicator />}
              </div>
            )}
          </div>

          {/* ── Input Bar (Pinned at Bottom) ── */}
          <div
            className="dashboard-composer"
            style={{
              flexShrink: 0,
              padding: '14px 16px 16px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(13,14,16,0.98)',
            }}
          >
            <div style={{ margin: '0 auto', maxWidth: '800px' }}>
              <div
                className="glass-input-box composer-box"
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: '10px',
                  borderRadius: '18px',
                  padding: '12px 14px',
                  border: '1px solid rgba(255,255,255,0.09)',
                }}
              >
                <textarea
                  className="composer-input"
                  ref={textareaRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  placeholder="Ask anything…"
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    resize: 'none',
                    background: 'transparent',
                    fontSize: '0.92rem',
                    color: 'rgba(255,255,255,0.9)',
                    outline: 'none',
                    lineHeight: '1.6',
                    maxHeight: '130px',
                    minHeight: '26px',
                    opacity: isLoading ? 0.45 : 1,
                    fontFamily: 'inherit',
                  }}
                />

                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isLoading}
                  className={input.trim() && !isLoading ? 'send-btn-active' : ''}
                  style={{
                    display: 'flex',
                    height: '36px',
                    width: '36px',
                    flexShrink: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '12px',
                    transition: 'all 0.2s',
                    color: '#fff',
                    cursor: !input.trim() || isLoading ? 'not-allowed' : 'pointer',
                    background: !input.trim() || isLoading ? 'rgba(255,255,255,0.05)' : undefined,
                  }}
                >
                  {isLoading ? <span className="spinner" /> : <IconSend />}
                </button>
              </div>

              <p className="input-hint" style={{ marginTop: '8px', textAlign: 'center', fontSize: '0.62rem', color: 'rgba(255,255,255,0.2)', userSelect: 'none' }}>
                <kbd style={{ borderRadius: '4px', background: 'rgba(255,255,255,0.05)', padding: '2px 5px', fontFamily: 'monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.28)' }}>Enter</kbd>
                {' '}to send
                &nbsp;·&nbsp;
                <kbd style={{ borderRadius: '4px', background: 'rgba(255,255,255,0.05)', padding: '2px 5px', fontFamily: 'monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.28)' }}>Shift+Enter</kbd>
                {' '}for new line
              </p>
            </div>
          </div>

        </section>
      </main>
    </>
  )
}

export default Dashboard
