import { useState, useRef, useEffect } from 'react'
import { Bot, X, Send, Sparkles, GraduationCap } from 'lucide-react'
import { getCounsellorReply, CHAT_SUGGESTIONS } from '../../lib/counsellor'

const WELCOME = 'Vanakkam! 🙏 I\'m your AI Counsellor.\n\nAsk me in English or Tanglish:\n• "Which college for 85%?"\n• "PSG vs KCT — which is better?"\n• "Does TCE have hostel?"\n• "What are PSG fees?"'

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{ role: 'bot', text: WELCOME }])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [chips, setChips] = useState(CHAT_SUGGESTIONS.slice(0, 4))
  const endRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing, open])

  const send = (raw) => {
    const text = String(raw ?? input).trim()
    if (!text || typing) return
    setMessages(m => [...m, { role: 'user', text }])
    setInput('')
    setTyping(true)
    let reply
    try {
      reply = getCounsellorReply(text)
    } catch {
      reply = { text: 'Sorry, something went wrong — please try again!' }
    }
    const delay = 500 + Math.min(900, text.length * 8)
    setTimeout(() => {
      setTyping(false)
      setMessages(m => [...m, { role: 'bot', text: reply.text }])
      if (reply.chips?.length) setChips(reply.chips)
    }, delay)
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => { setOpen(o => !o); setTimeout(() => inputRef.current?.focus(), 150) }}
        className="fixed bottom-5 right-5 z-[70] h-14 w-14 rounded-full bg-[#1A3263] border-[3px] border-[#FAB95B] shadow-[0_8px_28px_rgba(26,50,99,0.45)] grid place-items-center text-[#FAB95B] hover:scale-105 active:scale-95 transition-transform"
        aria-label="Open AI Counsellor chat"
      >
        {open ? <X size={24} /> : <Bot size={26} />}
        {!open && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#FAB95B] border-2 border-white grid place-items-center">
            <Sparkles size={9} className="text-[#1A3263]" />
          </span>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-[88px] right-5 z-[70] w-[calc(100vw-40px)] sm:w-[400px] max-h-[min(600px,calc(100vh-120px))] rounded-[24px] overflow-hidden bg-[#E8E2DB] border-2 border-[#1A3263]/20 shadow-[0_20px_60px_rgba(26,50,99,0.35)] flex flex-col animate-[chatIn_.25s_ease-out]">
          {/* Header */}
          <div className="bg-[#1A3263] text-white px-5 py-3.5 flex items-center gap-3 border-b-4 border-[#FAB95B] shrink-0">
            <div className="h-10 w-10 rounded-[12px] bg-[#FAB95B] text-[#1A3263] grid place-items-center shrink-0">
              <GraduationCap size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-[14px] leading-tight">AI Counsellor</div>
              <div className="text-[10px] text-[#FAB95B] font-semibold tracking-wide flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> ONLINE • Tamil / English / Tanglish
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="h-8 w-8 grid place-items-center rounded-full hover:bg-white/10" aria-label="Close chat">
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-[240px]">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'bot' && (
                  <div className="h-7 w-7 rounded-[8px] bg-[#1A3263] text-[#FAB95B] grid place-items-center shrink-0 mt-0.5">
                    <Bot size={14} />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-[16px] px-3.5 py-2.5 text-[12.5px] leading-[1.55] whitespace-pre-line shadow-sm ${
                    m.role === 'user'
                      ? 'bg-[#1A3263] text-white rounded-br-[4px]'
                      : 'bg-white text-[#1A3263] border-2 border-[#E8E2DB] rounded-bl-[4px]'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex gap-2">
                <div className="h-7 w-7 rounded-[8px] bg-[#1A3263] text-[#FAB95B] grid place-items-center shrink-0 mt-0.5">
                  <Bot size={14} />
                </div>
                <div className="bg-white border-2 border-[#E8E2DB] rounded-[16px] rounded-bl-[4px] px-4 py-3 flex gap-1.5 items-center">
                  <span className="h-2 w-2 rounded-full bg-[#547792] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 rounded-full bg-[#547792] animate-bounce" style={{ animationDelay: '120ms' }} />
                  <span className="h-2 w-2 rounded-full bg-[#FAB95B] animate-bounce" style={{ animationDelay: '240ms' }} />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Suggestion chips */}
          <div className="px-3 pb-2 flex gap-1.5 overflow-x-auto shrink-0">
            {chips.map((chip, i) => (
              <button
                key={`${chip}-${i}`}
                onClick={() => send(chip)}
                disabled={typing}
                className="px-3 py-1.5 rounded-full bg-white border-2 border-[#FAB95B]/40 text-[10.5px] font-bold text-[#1A3263] whitespace-nowrap hover:border-[#FAB95B] hover:bg-[#FAB95B]/10 transition-colors disabled:opacity-50 shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 pt-1 shrink-0">
            <div className="flex items-center gap-2 bg-white rounded-full border-2 border-[#1A3263]/10 focus-within:border-[#FAB95B] px-4 h-12 transition-colors">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') send() }}
                placeholder='Kelunga... e.g. "85% ku enna college?"'
                className="flex-1 bg-transparent outline-none text-[12.5px] text-[#1A3263] placeholder:text-[#547792]/60"
              />
              <button
                onClick={() => send()}
                disabled={typing || !input.trim()}
                className="h-8 w-8 rounded-full bg-[#1A3263] text-[#FAB95B] grid place-items-center disabled:opacity-40 hover:bg-[#547792] transition-colors shrink-0"
                aria-label="Send message"
              >
                <Send size={14} />
              </button>
            </div>
            <div className="text-[9px] text-center text-[#547792] mt-1.5 tracking-wide">
              AI Counsellor • demo — live Spring Boot backend connect panna real AI-a upgrade panna mudiyum
            </div>
          </div>
        </div>
      )}
    </>
  )
}
