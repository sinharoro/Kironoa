'use client'

import Image from 'next/image'
import { useState } from 'react'
import CardModal from '@/components/modals/CardModal'

export default function ProfileCard() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="glass-card p-6 sm:p-8 flex flex-col cursor-pointer" onClick={() => setOpen(true)}>
        <div className="mb-4">
          <Image
            src="/images/nge.jpg"
            alt="Kironoa Roro"
            width={100}
            height={100}
            className="w-20 h-20 sm:w-24 sm:h-24 object-cover"
            style={{ 
              borderRadius: '50%', 
              border: '2px solid rgba(255,255,255,0.2)',
              boxShadow: '0 0 20px rgba(232,115,44,0.3)'
            }}
          />
        </div>
        
        <h2 className="font-semibold text-xl sm:text-2xl mb-2">
          Kironoa Roro
        </h2>
        
        <hr className="border-t border-white/10 w-full my-3" />
        
        <p className="font-mono text-xs uppercase tracking-widest opacity-60 mb-4">
          BSCS Student
        </p>
        
        <span className="badge">
          Open to Work
        </span>
      </div>

      {open && (
        <CardModal title="Rolando F. Lobido Jr." onClose={() => setOpen(false)}>
          <div className="flex flex-col items-center gap-4">
            <Image
              src="/images/mwemwe.jpg"
              alt="Profile"
              width={200}
              height={200}
              className="w-40 h-40 object-cover rounded-2xl"
              style={{ border: '2px solid rgba(255,255,255,0.1)' }}
            />
            <div>
              <h3 className="font-mono text-orange-400 mb-2">Bio</h3>
              <p className="opacity-80 leading-relaxed">
                Vibe coder who learns by doing and experimenting.
              </p>
            </div>
          </div>
        </CardModal>
      )}
    </>
  )
}