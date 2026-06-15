import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProductActions from '@/components/ProductActions'

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

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link href="/products" className="text-gray-400 hover:text-gray-600 transition-colors">
          ← 목록으로
        </Link>
        {isOwner && <ProductActions productId={product.id} />}
      </div>

      <div className="bg-white rounded-2xl border border-violet-100 overflow-hidden">
        {/* 이미지 자리 */}
        <div className="w-full aspect-video bg-violet-50 flex items-center justify-center text-7xl">
          🛍️
        </div>

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
        </div>
      </div>
    </div>
  )
}
