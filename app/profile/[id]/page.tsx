import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createClient()
  const [{ data: profile }, { data: { user } }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', id).single(),
    supabase.auth.getUser(),
  ])

  if (!profile) notFound()

  const isMe = user?.id === id

  const { data: products } = await supabase
    .from('products')
    .select('id, title, price, category, condition, status, created_at, image_urls, like_count')
    .eq('seller_id', id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* 프로필 카드 */}
      <div className="bg-white rounded-2xl border border-violet-100 p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-violet-100 flex items-center justify-center shrink-0">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.nickname} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl">🍠</span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3">
              <h1 className="text-xl font-bold text-gray-900 truncate">{profile.nickname}</h1>
              {isMe && (
                <Link
                  href="/profile/edit"
                  className="shrink-0 px-4 py-2 text-sm font-semibold border border-violet-300 text-violet-600 rounded-xl hover:bg-violet-50 transition-colors"
                >
                  프로필 수정
                </Link>
              )}
            </div>
            <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed mt-2">
              {profile.bio || (isMe ? '아직 자기소개가 없어요. 프로필을 수정해 나를 소개해보세요!' : '아직 자기소개가 없어요.')}
            </p>
          </div>
        </div>
      </div>

      {/* 작성한 판매글 */}
      <div className="flex items-center gap-2 mb-4">
        <h2 className="font-bold text-gray-900">
          {isMe ? '내 판매글' : `${profile.nickname}님의 판매글`}
        </h2>
        <span className="text-sm text-gray-400">{products?.length ?? 0}</span>
      </div>

      {!products || products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-violet-100">
          <div className="text-4xl mb-3">🍠</div>
          <p className="text-gray-500 font-medium">아직 올린 판매글이 없어요</p>
          {isMe && (
            <Link
              href="/sell"
              className="mt-5 px-5 py-2 bg-violet-600 text-white rounded-full text-sm font-semibold hover:bg-violet-700 transition-colors"
            >
              판매글 작성하기
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}
