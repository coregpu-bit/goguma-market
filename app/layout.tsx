import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: '고구마켓 - 우리 동네 중고거래',
  description: '고구마켓에서 가까운 이웃과 중고 거래를 시작해보세요.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const userInfo = user
    ? {
        email: user.email,
        nickname: user.user_metadata?.nickname as string | undefined,
      }
    : null

  return (
    <html lang="ko">
      <body className="min-h-screen bg-violet-50 text-gray-800 antialiased">
        <Navbar user={userInfo} />
        <main>{children}</main>
      </body>
    </html>
  )
}
