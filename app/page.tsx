import Link from 'next/link'
import HomeHero from '@/components/HomeHero'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <HomeHero />
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          우리 동네<br />
          <span className="text-violet-600">고구마켓</span>
        </h1>
        <p className="text-lg text-gray-500 mb-10 max-w-md">
          가까운 이웃과 중고 물건을 사고팔아요.<br />
          믿을 수 있는 동네 거래 플랫폼
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={user ? '/dashboard' : '/signup'}
            className="px-8 py-3 bg-violet-600 text-white rounded-full font-semibold text-base hover:bg-violet-700 transition-colors shadow-md shadow-violet-200"
          >
            {user ? '홈으로' : '시작하기'}
          </Link>
          {!user && (
            <Link
              href="/login"
              className="px-8 py-3 bg-white text-violet-600 border-2 border-violet-400 rounded-full font-semibold text-base hover:bg-violet-50 transition-colors"
            >
              로그인
            </Link>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">
            고구마켓이 특별한 이유
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { emoji: '🏘️', title: '동네 거래', desc: '우리 동네 이웃과 직접 만나 안전하게 거래해요' },
              { emoji: '💰', title: '합리적인 가격', desc: '새 제품보다 저렴하게 필요한 물건을 구해요' },
              { emoji: '🌱', title: '환경 보호', desc: '물건을 재사용해서 환경을 함께 지켜요' },
            ].map((item) => (
              <div
                key={item.title}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-violet-50 hover:bg-violet-100 transition-colors"
              >
                <div className="text-4xl mb-3">{item.emoji}</div>
                <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-gray-400 bg-white border-t border-gray-100">
        © 2026 고구마켓 · 개발 학습용 프로젝트
      </footer>
    </div>
  )
}
