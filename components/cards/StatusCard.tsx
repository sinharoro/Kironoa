'use client'

import { useState } from 'react'
import CardModal from '@/components/modals/CardModal'

const CURRENT_FOCUS = 'Making Portfolio and Mobile Application'

export default function StatusCard() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="glass-card p-6 sm:p-8 flex flex-col" onClick={() => setOpen(true)}>
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <span className="w-3 h-3 rounded-full bg-green-500 block" />
            <span className="ping absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
          </div>
          <span className="font-mono text-xs uppercase tracking-widest opacity-80">ALL SYSTEMS OPERATIONAL</span>
        </div>
        
        <div className="mt-auto">
          <p className="font-mono text-xs uppercase opacity-50 mb-1">Current Focus:</p>
          <p className="text-sm opacity-80">{CURRENT_FOCUS}</p>
        </div>
      </div>

      {open && (
        <CardModal title="What's on the list" onClose={() => setOpen(false)}>
          <p className="opacity-80 mb-3">Things I want to try:</p>
          <ul className="list-disc list-inside leading-relaxed opacity-90 space-y-2">
            <li>Build a Space Impact clone</li>
            <li>Master Glassmorphism UI</li>
            <li>Build a Remote Control Using Mobile Phone</li>
            <li>Mastering Design</li>
          </ul>
        </CardModal>
      )}
    </>
  )
}