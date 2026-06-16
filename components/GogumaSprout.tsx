// 좋아요 수에 따라 자라는 고구마 아이콘
// 0개: 씨앗 → 1개: 새싹 → 2개: 잎 두 장 → 3~4개: 아기 고구마 → 5개 이상: 다 자란 고구마

export function likeStage(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0) return 0
  if (count === 1) return 1
  if (count === 2) return 2
  if (count <= 4) return 3
  return 4
}

const SOIL = (
  <g>
    <ellipse cx="24" cy="41" rx="14" ry="4" fill="#E2C290" />
    <path d="M10 41 Q24 36.5 38 41" stroke="#C99A5B" strokeWidth="1.2" fill="none" opacity="0.6" />
  </g>
)

function Stage({ stage }: { stage: 0 | 1 | 2 | 3 | 4 }) {
  switch (stage) {
    case 0:
      return (
        <g>
          {SOIL}
          <ellipse cx="24" cy="36" rx="5.5" ry="4.5" fill="#9C6B3E" />
          <ellipse cx="22.3" cy="34.4" rx="2" ry="1.3" fill="#C08A55" opacity="0.7" />
        </g>
      )
    case 1:
      return (
        <g>
          {SOIL}
          <path d="M24 39 C24 33 24 30 24 26" stroke="#5DA040" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          <path d="M24 28 C19.5 27 16 23.5 17 20 C21 20 24 23.5 24 28 Z" fill="#62A842" />
        </g>
      )
    case 2:
      return (
        <g>
          {SOIL}
          <path d="M24 39 C24 32 24 28 24 22" stroke="#5DA040" strokeWidth="2.6" strokeLinecap="round" fill="none" />
          <path d="M24 27 C18.5 26 14.5 22 15.5 18 C20 18 24 22 24 27 Z" fill="#4E8C31" />
          <path d="M24 25 C29.5 24 33.5 20 32.5 16 C28 16 24 20 24 25 Z" fill="#62A842" />
        </g>
      )
    case 3:
      return (
        <g>
          {SOIL}
          <path d="M22 26 C20 19.5 14 16.5 16 11.5 C20 13.5 23 19.5 23 26 Z" fill="#4E8C31" />
          <path d="M26 26 C28 19.5 34 16.5 32 11.5 C28 13.5 25 19.5 25 26 Z" fill="#5DA040" />
          <ellipse cx="24" cy="33" rx="10" ry="8" fill="#6D28D9" />
          <ellipse cx="20" cy="30" rx="5" ry="3" fill="#A78BFA" opacity="0.5" />
          <ellipse cx="27" cy="37" rx="5" ry="2.6" fill="#4C1D95" opacity="0.3" />
        </g>
      )
    case 4:
      return (
        <g>
          <path d="M21 20 C19 13 12 10 14 4 C19 6 23 13 23 20 Z" fill="#4E8C31" />
          <path d="M24 19 C24 12 24 6 24 3 C26 7 26 13 25 19 Z" fill="#5DA040" />
          <path d="M27 20 C29 13 36 10 34 4 C29 6 25 13 25 20 Z" fill="#62A842" />
          <ellipse cx="24" cy="30.5" rx="13" ry="11" fill="#6D28D9" />
          <ellipse cx="19" cy="25.5" rx="7" ry="4" fill="#A78BFA" opacity="0.5" />
          <ellipse cx="27.5" cy="36" rx="7" ry="4" fill="#4C1D95" opacity="0.35" />
          <path d="M38 13 l0.9 2 2 0.9 -2 0.9 -0.9 2 -0.9 -2 -2 -0.9 2 -0.9 Z" fill="#FBBF24" />
        </g>
      )
  }
}

export default function GogumaSprout({
  count,
  size = 48,
  className = '',
}: {
  count: number
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <Stage stage={likeStage(count)} />
    </svg>
  )
}
