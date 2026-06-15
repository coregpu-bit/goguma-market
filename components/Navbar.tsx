'use client'

import Link from 'next/link'
import { logout } from '@/app/actions/auth'
import GomuCharacter from './GomuCharacter'

interface NavbarProps {
  user: { email?: string; nickname?: string } | null
}

export default function Navbar({ user }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-violet-100 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5 font-bold text-xl text-violet-600 hover:text-violet-700 transition-colors">
          <GomuCharacter size={30} />
          <span>고구마켓</span>
        </Link>

        <nav className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden sm:block text-sm text-gray-500">
                <span className="font-semibold text-gray-800">
                  {user.nickname ?? user.email?.split('@')[0]}
                </span>
                님
              </span>
              <Link
                href="/products"
                className="text-sm text-gray-600 hover:text-violet-600 transition-colors"
              >
                중고거래
              </Link>
              <Link
                href="/dashboard"
                className="text-sm text-gray-600 hover:text-violet-600 transition-colors"
              >
                홈
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="text-sm px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-violet-400 hover:text-violet-600 transition-colors"
                >
                  로그아웃
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-violet-600 transition-colors"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="text-sm px-4 py-1.5 rounded-full bg-violet-600 text-white hover:bg-violet-700 transition-colors font-medium"
              >
                회원가입
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
