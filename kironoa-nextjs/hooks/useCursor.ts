'use client'

import { useEffect } from 'react'

export function useCursorFollower() {
  useEffect(() => {
    const cursor = document.querySelector('.cursor-follower') as HTMLElement | null
    if (!cursor) return

    const move = (e: MouseEvent) => {
      cursor.style.left = e.clientX + 'px'
      cursor.style.top  = e.clientY + 'px'
    }

    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])
}
