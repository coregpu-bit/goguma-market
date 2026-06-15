import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '@/app/actions/auth'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const nickname = (user.user_metadata?.nickname as string) ?? user.email?.split('@')[0] ?? '이웃'

  const { data: products } = await supabase
    .from('products')
    .select('id, title, price, category, condition, status, created_at')
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* 환영 배너 */}
      <div className="bg-gradient-to-r from-violet-500 to-violet-600 rounded-2xl p-6 mb-8 text-white shadow-md shadow-violet-200 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-violet-200 text-sm mb-1">우리 동네 고구마켓</p>
            <h2 className="text-2xl font-bold">
              안녕하세요, {nickname}님! 👋
            </h2>
            <p className="text-violet-200 text-sm mt-1">{user.email}</p>
          </div>
          <div className="text-6xl opacity-80">🍠</div>
        </div>
      </div>

      {/* 빠른 메뉴 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Link
          href="/sell"
          className="relative bg-white rounded-2xl p-4 text-center border border-violet-100 hover:border-violet-300 hover:shadow-md transition-all"
        >
          <div className="text-3xl mb-2">📦</div>
          <div className="font-semibold text-sm text-gray-800">판매하기</div>
          <div className="text-xs text-gray-400 mt-0.5">내 물건 팔기</div>
        </Link>
        <Link
          href="/products"
          className="relative bg-white rounded-2xl p-4 text-center border border-violet-100 hover:border-violet-300 hover:shadow-md transition-all"
        >
          <div className="text-3xl mb-2">🔍</div>
          <div className="font-semibold text-sm text-gray-800">구매하기</div>
          <div className="text-xs text-gray-400 mt-0.5">동네 중고 구경</div>
        </Link>
        {[
          { emoji: '💬', label: '채팅', desc: '이웃과 대화' },
          { emoji: '❤️', label: '관심목록', desc: '찜한 물건 보기' },
        ].map((item) => (
          <button
            key={item.label}
            className="relative bg-white rounded-2xl p-4 text-center border border-violet-100 hover:border-violet-300 hover:shadow-md transition-all"
            disabled
          >
            <span className="absolute top-2 right-2 text-[10px] bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded-full font-medium">
              준비중
            </span>
            <div className="text-3xl mb-2">{item.emoji}</div>
            <div className="font-semibold text-sm text-gray-800">{item.label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{item.desc}</div>
          </button>
        ))}
      </div>

      {/* 판매글 목록 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">최근 판매글</h2>
          <Link href="/sell" className="text-sm text-violet-600 hover:underline">
            + 글쓰기
          </Link>
        </div>

        {!products || products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-violet-100 flex flex-col items-center justify-center py-16 text-center">
            <div className="text-4xl mb-3">🍠</div>
            <p className="text-gray-500 font-medium">아직 등록된 판매글이 없어요</p>
            <p className="text-sm text-gray-400 mt-1">첫 번째로 물건을 올려보세요!</p>
            <Link
              href="/sell"
              className="mt-5 px-5 py-2 bg-violet-600 text-white rounded-full text-sm font-semibold hover:bg-violet-700 transition-colors"
            >
              판매글 작성하기
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 pt-5">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>

      {/* 안내 카드 */}
      <div className="bg-white rounded-2xl border border-violet-100 p-6">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>🚧</span> 개발 진행 중
        </h3>
        <div className="space-y-3">
          {[
            { step: '1단계', text: '회원가입 / 로그인 / 로그아웃', done: true },
            { step: '2단계', text: '상품 등록 및 목록 조회', done: true },
            { step: '3단계', text: '상품 상세 페이지', done: false },
            { step: '4단계', text: '채팅 기능', done: false },
            { step: '5단계', text: '관심 목록', done: false },
          ].map((item) => (
            <div key={item.step} className="flex items-center gap-3 text-sm">
              <span
                className={`w-16 text-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  item.done
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {item.step}
              </span>
              <span className={item.done ? 'text-gray-700' : 'text-gray-400'}>
                {item.done ? '✅' : '⬜'} {item.text}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <form action={logout}>
            <button
              type="submit"
              className="text-sm text-gray-400 hover:text-red-400 transition-colors"
            >
              로그아웃
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
