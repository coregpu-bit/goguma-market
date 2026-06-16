'use client'

import { useState, useEffect } from 'react'
import GomuCharacter from './GomuCharacter'
import GogumaSprout from './GogumaSprout'

// 성장 단계별 말풍선 (씨앗 → 다 자란 고구마)
const GREETINGS = [
  '씨앗을 심었어요 🌰',
  '새싹이 돋았어요 🌱',
  '쑥쑥 자라는 중 🌿',
  '아기 고구마 등장 🍠',
  '다 자랐어요! ✨',
]

export default function HomeHero() {
  // 0~3: 자라는 새싹, 4: 다 자란 고구마 캐릭터
  const [step, setStep] = useState(0)

  useEffect(() => {
    const delay = step === 4 ? 2400 : 720
    const timer = setTimeout(() => setStep(s => (s + 1) % 5), delay)
    return () => clearTimeout(timer)
  }, [step])

  return (
    <div className="relative inline-block mb-6">
      {/* 말풍선 */}
      <div
        className="absolute left-1/2 bottom-full mb-3 pointer-events-none"
        style={{ transform: 'translateX(-50%)' }}
      >
        <div
          key={step}
          className="goguma-grow relative bg-violet-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md whitespace-nowrap"
        >
          {GREETINGS[step]}
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

      {/* 고구마 — 씨앗부터 다 자란 고구마까지 성장 */}
      <div className="flex items-end justify-center" style={{ height: 130, width: 130 }}>
        {step < 4 ? (
          <div key={`sprout-${step}`} className="goguma-grow">
            <GogumaSprout count={step} size={130} />
          </div>
        ) : (
          <div key="grown" className="goguma-char">
            <GomuCharacter size={110} />
          </div>
        )}
      </div>
    </div>
  )
}
