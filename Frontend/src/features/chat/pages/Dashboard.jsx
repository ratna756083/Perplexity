import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import { initializeSocketConnection } from '../service/chat.socket'
import { useChat } from '../hooks/useChat'

const Dashboard = () => {
  const chat=useChat()
 
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { sender: 'user', text: 'user message' },
    { sender: 'ai', text: 'AI message' },
  ])

  const chats=useSelector(state=>state.chat.chats)
  const currentChatId=useSelector(state=>state.chat.currentChatId)

  useEffect(() => {
    chat.initializeSocketConnection()
    chat.handelGetChats()
  }, [])

  const openChat = async (chatId) => {
    if (!chatId || chatId === currentChatId) return
    await chat.handelOpenChats(chats,chatId)
  }

  const handleSendMessage = async () => {
    const trimmed = input.trim()
    if (!trimmed) return

    await chat.handelSendMessage({
      message: trimmed,
      chatId: currentChatId,
    })

    setInput('')
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <main className='h-screen w-full overflow-hidden bg-[#1c1d1f] text-white'>
      <div className='flex h-full w-full border border-white/10 bg-[#1d1d1f]'>
        <aside className='flex w-[320px] flex-col border-r border-white/10 bg-[#202224] p-4 overflow-hidden'>
          <div className='mb-6 px-2 py-1'>
            <h1 className='text-[2rem] font-medium tracking-tight text-white/90'>Perplexity</h1>
          </div>

          <div className='space-y-3 overflow-hidden'>
            {Object.values(chats).map((chat) => (
              <button
                onClick={() => {
                  openChat(chat.id)
                }}
                key={chat.id}
                className={`w-full rounded-xl border border-white/15 px-4 py-3 text-left text-[1.05rem] text-white/70 transition hover:bg-white/5 ${
                  currentChatId === chat.id ? 'bg-[#0f1113] text-white' : 'bg-[#171a1d]'
                }`}
              >
                {chat.title}
              </button>
            ))}
          </div>
        </aside>

        <section className='flex flex-1 flex-col bg-[#111315]'>
          <div className='messages flex h-full flex-col px-6 py-5'>
            <div className='flex-1 overflow-y-auto overflow-x-hidden px-4 pt-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'>
              <div className=' messages flex flex-col gap-4'>
                {chats[currentChatId]?.messages?.map((message, index) => {
                  const isUser = message.role === 'user'

                  return (
                    <div
                      key={`${message.role}-${index}`}
                      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl border-none px-5 py-3 text-[1.05rem] ${
                          isUser
                            ? 'border-white/15 bg-[#1161b1] text-white/90'
                            : 'border-white/15 bg-[#0f1113] text-white/90'
                        }`}
                      >
                        {isUser ? (
                          message.content
                        ) : (
                          <div className='markdown-content  space-y-2 leading-7 text-white/90'>
                            <ReactMarkdown
                              components={{
                                p: ({ children }) => <p className='mb-2 last:mb-0'>{children}</p>,
                                ul: ({ children }) => <ul className='mb-2 list-disc space-y-1 pl-5'>{children}</ul>,
                                ol: ({ children }) => <ol className='mb-2 list-decimal space-y-1 pl-5'>{children}</ol>,
                                li: ({ children }) => <li className='leading-7'>{children}</li>,
                                strong: ({ children }) => <strong className='font-semibold text-white'>{children}</strong>,
                                em: ({ children }) => <em className='italic text-white/80'>{children}</em>,
                                code: ({ children, className }) => (
                                  <code className={`rounded bg-white/10 px-1 py-0.5 text-[0.9em] ${className || ''}`}>
                                    {children}
                                  </code>
                                ),
                                pre: ({ children }) => (
                                  <pre className='mb-2 overflow-x-auto rounded-lg bg-black/20 p-3 text-sm'>
                                    {children}
                                  </pre>
                                ),
                                a: ({ href, children }) => (
                                  <a href={href} target='_blank' rel='noreferrer' className='text-blue-300 underline'>
                                    {children}
                                  </a>
                                ),
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className='mx-auto mt-3 w-full max-w-[800px] rounded-full border border-[#e5e5e5] bg-[#171616] px-3 py-1.5 shadow-[0_1px_4px_rgba(0,0,0,0.08)]'>
              <div className='flex items-center gap-2'>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  placeholder='Message ChatGPT'
                  className='max-h-16 min-h-[20px] flex-1 resize-none bg-transparent text-[0.8rem] text-white placeholder:text-gray-500 focus:outline-none'
                />

                <button
                  type='button'
                  onClick={handleSendMessage}
                  className='flex h-7 w-7 items-center justify-center rounded-full bg-[#1715b2] text-[0.6rem] font-semibold text-white transition hover:bg-gray-800'
                >
                  ↑
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Dashboard
