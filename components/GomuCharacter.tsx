interface GomuCharacterProps {
  size?: number
  className?: string
}

export default function GomuCharacter({ size = 80, className = '' }: GomuCharacterProps) {
  return (
    <svg
      width={size}
      height={Math.round(size * 1.18)}
      viewBox="0 0 100 118"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 그림자 */}
      <ellipse cx="50" cy="112" rx="27" ry="5" fill="#00000012" />

      {/* 몸통 — 고구마 보라색 */}
      <ellipse cx="50" cy="74" rx="38" ry="29" fill="#6D28D9" />
      {/* 몸통 상단 하이라이트 */}
      <ellipse cx="43" cy="61" rx="22" ry="12" fill="#A78BFA" opacity="0.45" />
      {/* 몸통 하단 음영 */}
      <ellipse cx="54" cy="88" rx="20" ry="10" fill="#4C1D95" opacity="0.35" />

      {/* 잎사귀 왼쪽 */}
      <path
        d="M 44 48 C 42 35 29 24 36 14 C 39 9 47 19 46 30"
        fill="#4E8C31"
      />
      <path
        d="M 44 48 C 42 35 29 24 36 14 C 33 18 36 30 42 40"
        fill="#62A842"
        opacity="0.7"
      />

      {/* 잎사귀 가운데 */}
      <path
        d="M 50 46 C 50 30 50 14 50 9 C 53 14 54 30 52 46"
        fill="#5DA040"
      />

      {/* 잎사귀 오른쪽 */}
      <path
        d="M 56 48 C 58 35 71 24 64 14 C 61 9 53 19 54 30"
        fill="#4E8C31"
      />
      <path
        d="M 56 48 C 58 35 71 24 64 14 C 67 18 64 30 58 40"
        fill="#62A842"
        opacity="0.7"
      />

      {/* 왼쪽 눈 */}
      <circle cx="36" cy="69" r="9.5" fill="white" />
      <circle cx="37.5" cy="69" r="6.5" fill="#1A1A1A" />
      <circle cx="39.5" cy="66" r="2.5" fill="white" />
      <path d="M 29 73 Q 36 79 43 73" stroke="#1A1A1A" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.25" />

      {/* 오른쪽 눈 */}
      <circle cx="64" cy="69" r="9.5" fill="white" />
      <circle cx="65.5" cy="69" r="6.5" fill="#1A1A1A" />
      <circle cx="67.5" cy="66" r="2.5" fill="white" />
      <path d="M 57 73 Q 64 79 71 73" stroke="#1A1A1A" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.25" />

      {/* 볼 터치 */}
      <ellipse cx="24" cy="77" rx="8" ry="5" fill="#FF9292" opacity="0.5" />
      <ellipse cx="76" cy="77" rx="8" ry="5" fill="#FF9292" opacity="0.5" />

      {/* 입 */}
      <path
        d="M 39 82 Q 50 94 61 82"
        stroke="#1A1A1A"
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 41 83 Q 50 91 59 83"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
    </svg>
  )
}
