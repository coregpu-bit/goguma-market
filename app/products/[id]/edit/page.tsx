'use client'

import { use, useActionState } from 'react'
import Link from 'next/link'
import { updateProduct } from '@/app/actions/product'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUploader from '@/components/ImageUploader'

const CATEGORIES = ['디지털/가전', '의류/잡화', '가구/인테리어', '도서/음반', '스포츠/레저', '생활/주방', '기타']
const CONDITIONS = [
  { value: '새상품', desc: '사용하지 않은 새 제품' },
  { value: '거의 새것', desc: '1~2번 사용, 흠집 없음' },
  { value: '양호', desc: '사용감 있지만 기능 정상' },
  { value: '보통', desc: '사용감 많음, 기능 정상' },
]

type Product = {
  id: string
  title: string
  description: string
  price: number
  category: string
  condition: string
  seller_id: string
  image_urls: string[] | null
}

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [state, action, pending] = useActionState(updateProduct, undefined)

  useEffect(() => {
    const supabase = createClient()
    Promise.all([
      supabase.from('products').select('*').eq('id', id).single(),
      supabase.auth.getUser(),
    ]).then(([{ data: product }, { data: { user } }]) => {
      if (!product || product.seller_id !== user?.id) {
        router.replace('/products')
        return
      }
      setProduct(product)
      setLoading(false)
    })
  }, [id, router])

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8 text-center text-gray-400">
        불러오는 중...
      </div>
    )
  }

  if (!product) return null

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/products/${id}`} className="text-gray-400 hover:text-gray-600 transition-colors">
          ← 뒤로
        </Link>
        <h1 className="text-xl font-bold text-gray-900">판매글 수정</h1>
      </div>

      <div className="bg-white rounded-2xl border border-violet-100 p-6">
        <form action={action} className="space-y-5">
          <input type="hidden" name="id" value={product.id} />

          {/* 사진 */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">사진</p>
            <ImageUploader existingUrls={product.image_urls ?? []} />
            <p className="text-xs text-gray-400 mt-1">최대 5장 · 파일당 5MB 이하</p>
          </div>

          {/* 제목 */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              제목 <span className="text-violet-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              defaultValue={product.title}
              required
              maxLength={50}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent transition"
            />
          </div>

          {/* 카테고리 */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              카테고리 <span className="text-violet-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              required
              defaultValue={product.category}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent transition bg-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* 상태 */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              물건 상태 <span className="text-violet-500">*</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              {CONDITIONS.map(({ value, desc }) => (
                <label
                  key={value}
                  className="flex items-start gap-2 p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-violet-300 hover:bg-violet-50 transition has-[:checked]:border-violet-500 has-[:checked]:bg-violet-50"
                >
                  <input
                    type="radio"
                    name="condition"
                    value={value}
                    defaultChecked={product.condition === value}
                    required
                    className="mt-0.5 accent-violet-600"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-800">{value}</div>
                    <div className="text-xs text-gray-400">{desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* 가격 */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              가격 <span className="text-violet-500">*</span>
            </label>
            <div className="relative">
              <input
                id="price"
                name="price"
                type="number"
                defaultValue={product.price}
                required
                min="0"
                className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent transition"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">원</span>
            </div>
          </div>

          {/* 설명 */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              설명 <span className="text-violet-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={product.description}
              required
              rows={5}
              maxLength={1000}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent transition resize-none"
            />
          </div>

          {state?.error && (
            <div className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full py-3 bg-violet-600 text-white rounded-xl font-semibold text-sm hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {pending ? '저장 중...' : '수정 완료'}
          </button>
        </form>
      </div>
    </div>
  )
}
