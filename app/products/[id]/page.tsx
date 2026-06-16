import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProductActions from '@/components/ProductActions'
import ImageGallery from '@/components/ImageGallery'
import LikeButton from '@/components/LikeButton'
import CommentSection, { type CommentRow, type Thread } from '@/components/CommentSection'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createClient()
  const [{ data: product }, { data: { user } }] = await Promise.all([
    supabase.from('products').select('*').eq('id', id).single(),
    supabase.auth.getUser(),
  ])

  if (!product) notFound()

  const isOwner = user?.id === product.seller_id

  let liked = false
  if (user) {
    const { data: myLike } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', id)
      .maybeSingle()
    liked = !!myLike
  }

  // 댓글 불러오기 (일반 댓글 + 답글을 묶어서 정리)
  const { data: commentRows } = await supabase
    .from('comments')
    .select('id, user_id, parent_id, author_name, content, created_at, updated_at')
    .eq('product_id', id)
    .order('created_at', { ascending: true })

  const rows = (commentRows ?? []) as CommentRow[]
  const threads: Thread[] = rows
    .filter(c => c.parent_id === null)
    .map(c => ({
      ...c,
      replies: rows.filter(r => r.parent_id === c.id),
    }))

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link href="/products" className="text-gray-400 hover:text-gray-600 transition-colors">
          ← 목록으로
        </Link>
        {isOwner && <ProductActions productId={product.id} />}
      </div>

      <div className="bg-white rounded-2xl border border-violet-100 overflow-hidden">
        {product.image_urls?.length > 0 ? (
          <ImageGallery urls={product.image_urls} />
        ) : (
          <div className="w-full aspect-video bg-violet-50 flex items-center justify-center text-7xl">
            🛍️
          </div>
        )}

        <div className="p-6 space-y-5">
          {/* 제목 + 상태 */}
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-xl font-bold text-gray-900 leading-snug">{product.title}</h1>
            <span
              className={`shrink-0 text-xs px-2.5 py-1 rounded-full font-medium ${
                product.status === '판매중'
                  ? 'bg-violet-100 text-violet-600'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {product.status}
            </span>
          </div>

          {/* 가격 */}
          <p className="text-2xl font-bold text-gray-900">
            {product.price.toLocaleString()}원
          </p>

          {/* 태그 */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs bg-violet-50 text-violet-600 px-3 py-1 rounded-full font-medium">
              {product.category}
            </span>
            <span className="text-xs bg-violet-50 text-violet-600 px-3 py-1 rounded-full font-medium">
              {product.condition}
            </span>
          </div>

          <hr className="border-gray-100" />

          {/* 관심(좋아요) */}
          <div className="flex flex-col items-center py-2">
            <LikeButton
              productId={product.id}
              initialCount={product.like_count ?? 0}
              initialLiked={liked}
            />
          </div>

          <hr className="border-gray-100" />

          {/* 설명 */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 mb-2">상품 설명</h2>
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {product.description}
            </p>
          </div>

          <hr className="border-gray-100" />

          {/* 등록 정보 */}
          <p className="text-xs text-gray-400">등록일 {formatDate(product.created_at)}</p>

          <hr className="border-gray-100" />

          {/* 댓글 */}
          <CommentSection
            productId={product.id}
            sellerId={product.seller_id}
            currentUserId={user?.id ?? null}
            comments={threads}
          />
        </div>
      </div>
    </div>
  )
}
