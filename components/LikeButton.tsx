'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toggleLike } from '@/app/actions/like'
import GogumaSprout, { likeStage } from '@/components/GogumaSprout'

const STAGE_LABEL = ['씨앗', '새싹', '쑥쑥', '아기 고구마', '다 자란 고구마']

export default function LikeButton({
  productId,
  initialCount,
  initialLiked,
}: {
  productId: string
  initialCount: number
  initialLiked: boolean
}) {
  const router = useRouter()
  const [count, setCount] = useState(initialCount)
  const [liked, setLiked] = useState(initialLiked)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function handleClick() {
    if (pending) return
    setError(null)

    // 화면을 먼저 바꾸고(낙관적 업데이트) 서버에 반영
    const nextLiked = !liked
    setLiked(nextLiked)
    setCount(c => c + (nextLiked ? 1 : -1))

    startTransition(async () => {
      const result = await toggleLike(productId)
      if (result.error) {
        // 실패하면 되돌리기
        setLiked(!nextLiked)
        setCount(c => c + (nextLiked ? -1 : 1))
        if (result.error.includes('로그인')) {
          router.push('/login')
          return
        }
        setError(result.error)
        return
      }
      setLiked(result.liked)
    })
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        aria-pressed={liked}
        className={`flex flex-col items-center gap-1 px-6 py-4 rounded-2xl border-2 transition-all duration-200 active:scale-95 disabled:cursor-not-allowed ${
          liked
            ? 'border-violet-400 bg-violet-50 shadow-sm shadow-violet-100'
            : 'border-gray-200 bg-white hover:border-violet-300 hover:bg-violet-50/50'
        }`}
      >
        <GogumaSprout
          count={count}
          size={56}
          className={`transition-transform duration-300 ${liked ? 'scale-110' : ''}`}
        />
        <span className={`text-lg font-bold tabular-nums ${liked ? 'text-violet-600' : 'text-gray-700'}`}>
          {count}
        </span>
        <span className={`text-xs font-medium ${liked ? 'text-violet-500' : 'text-gray-400'}`}>
          {liked ? '관심 표시함' : '관심 있어요'}
        </span>
      </button>

      <p className="text-xs text-gray-400">
        지금은 <span className="font-medium text-gray-500">{STAGE_LABEL[likeStage(count)]}</span> 단계예요
      </p>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
