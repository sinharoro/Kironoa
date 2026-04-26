'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TIMEZONE = 'Asia/Manila'

function getLocalTime() {
  return new Date().toLocaleTimeString('en-US', {
    timeZone: TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })
}

export default function LivePulseStatusCard() {
  const [time, setTime] = useState(getLocalTime())
  const [status, setStatus] = useState<'scanning' | 'complete'>('scanning')
  const [scanningLine, setScanningLine] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getLocalTime())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setScanningLine(prev => (prev + 10) % 100)
    }, 50)

    const timeout = setTimeout(() => {
      setStatus('complete')
      clearInterval(interval)
    }, 2000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [])

  return (
    <div className="glass-card p-6 sm:p-8 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-widest opacity-60">System Status</span>
        <div className="flex items-center gap-2">
          <div className={`pulse-indicator ${status === 'complete' ? 'active' : ''}`} />
          <span className="font-mono text-xs uppercase opacity-60">
            {status === 'scanning' ? 'SCANNING...' : 'ONLINE'}
          </span>
        </div>
      </div>

      {status === 'scanning' && (
        <div className="relative h-8 bg-black/20 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-0 scan-line"
            animate={{ left: `${scanningLine}%` }}
            style={{ width: '30%', left: `${scanningLine}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-xs opacity-40">ANALYZING...</span>
          </div>
        </div>
      )}

      {status === 'complete' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-2"
        >
          <p className="text-green-400 font-mono text-sm">Status: 100% Vibe Check Passed</p>
        </motion.div>
      )}

      <div className="mt-auto pt-4 border-t border-white/5">
        <p className="font-mono text-xs uppercase opacity-40 mb-1">Local Time</p>
        <p className="text-2xl font-mono font-medium">{time}</p>
        <p className="font-mono text-xs opacity-40 mt-1">Tangub City, PH</p>
      </div>
    </div>
  )
}