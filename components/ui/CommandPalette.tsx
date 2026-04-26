'use client'

import { useEffect, useState } from 'react'
import { Command } from 'cmdk'
import { motion, AnimatePresence } from 'framer-motion'

const commands = [
  { id: 'home', label: 'Go to Home', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
  { id: 'skills', label: 'View Skills', action: () => document.getElementById('skills-section')?.scrollIntoView({ behavior: 'smooth' }) },
  { id: 'projects', label: 'View Projects', action: () => document.getElementById('projects-section')?.scrollIntoView({ behavior: 'smooth' }) },
  { id: 'certificates', label: 'View Certificates', action: () => document.getElementById('certificates-section')?.scrollIntoView({ behavior: 'smooth' }) },
  { id: 'github', label: 'Open GitHub', action: () => window.open('https://github.com', '_blank') },
  { id: 'linkedin', label: 'Open LinkedIn', action: () => window.open('https://linkedin.com', '_blank') },
]

export default function CommandPalette() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(true)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const handleSelect = (cmd: typeof commands[0]) => {
    cmd.action()
    setOpen(false)
  }

  return (
    <>
      <kbd className="fixed bottom-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-2 rounded-lg font-mono text-xs cursor-pointer hover:bg-white/20 transition-colors z-40 hidden sm:block" onClick={() => setOpen(true)}>
        Ctrl+K
      </kbd>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-[20vh]"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-lg mx-4"
              onClick={e => e.stopPropagation()}
            >
              <Command className="glass-card overflow-hidden">
                <Command.Input 
                  placeholder="Type a command..." 
                  className="w-full bg-transparent p-4 outline-none font-mono text-sm placeholder:text-white/40"
                />
                <Command.List className="max-h-[300px] overflow-y-auto p-2">
                  <Command.Empty className="p-4 text-center text-sm opacity-50">No results found.</Command.Empty>
                  {commands.map(cmd => (
                    <Command.Item
                      key={cmd.id}
                      value={cmd.label.toLowerCase()}
                      onSelect={() => handleSelect(cmd)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors data-[selected=true]:bg-orange-500/20 data-[selected=true]:text-orange-400"
                    >
                      <span className="text-sm">{cmd.label}</span>
                    </Command.Item>
                  ))}
                </Command.List>
              </Command>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}