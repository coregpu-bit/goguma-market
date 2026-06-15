'use client'

import { useState, useEffect } from 'react'
import GomuCharacter from './GomuCharacter'

const GREETINGS = [
  '안녕하세요! 👋',
  '어서오세요! 🍠',
  '반가워요! 😊',
  '함께 거래해요! 🛍️',
  '좋은 거래 하세요! ✨',
]

export default function HomeHero() {
  const [index, setIndex] = useState(0)
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setShow(false)
      setTimeout(() => {
        setIndex(i => (i + 1) % GREETINGS.length)
        setShow(true)
      }, 350)
    }, 2800)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative inline-block mb-6">
      {/* 말풍선 */}
      <div
        className="absolute left-1/2 bottom-full mb-3 pointer-events-none"
        style={{ transform: 'translateX(-50%)' }}
      >
        <div
          className="relative bg-violet-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md whitespace-nowrap transition-all duration-300"
          style={{
            opacity: show ? 1 : 0,
            transform: show ? 'scale(1) translateY(0px)' : 'scale(0.9) translateY(5px)',
          }}
        >
          {GREETINGS[index]}
          {/* 말풍선 꼬리 */}
          <div
            className="absolute left-1/2 top-full"
            style={{
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '7px solid #7c3aed',
            }}
          />
        </div>
      </div>

      {/* 고구마 캐릭터 — 등장 후 이리저리 흔들기 */}
      <div className="goguma-char">
        <GomuCharacter size={110} />
      </div>
    </div>
  )
}
