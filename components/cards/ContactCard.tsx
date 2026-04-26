'use client'

import { useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import { motion, AnimatePresence } from 'framer-motion'

export default function ContactCard() {
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const [sending, setSending] = useState(false)

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#C05621', '#f5a06e', '#e8732c'],
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    setSending(true)
    await new Promise(r => setTimeout(r, 600))
    setSending(false)
    setSuccess(true)
    triggerConfetti()
    setMessage('')
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <div className="glass-card p-6 sm:p-8 flex flex-col">
      <h2 className="font-semibold text-lg mb-3">Send Noodles</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-auto">
        <input
          type="text"
          placeholder="Your message..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          required
          className="w-full"
        />

        <button
          type="submit"
          disabled={sending}
          className="send-btn"
        >
          {sending ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending...
            </span>
          ) : (
            'Send'
          )}
        </button>
      </form>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 text-center text-orange-400 font-mono text-sm"
          >
            ✨ Noodles sent successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}