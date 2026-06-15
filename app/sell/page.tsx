'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createProduct } from '@/app/actions/product'

const CATEGORIES = ['디지털/가전', '의류/잡화', '가구/인테리어', '도서/음반', '스포츠/레저', '생활/주방', '기타']
const CONDITIONS = [
  { value: '새상품', desc: '사용하지 않은 새 제품' },
  { value: '거의 새것', desc: '1~2번 사용, 흠집 없음' },
  { value: '양호', desc: '사용감 있지만 기능 정상' },
  { value: '보통', desc: '사용감 많음, 기능 정상' },
]

export default function SellPage() {
  const [state, action, pending] = useActionState(createProduct, undefined)

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 transition-colors">
          ← 뒤로
        </Link>
        <h1 className="text-xl font-bold text-gray-900">판매글 작성</h1>
      </div>

      <div className="bg-white rounded-2xl border border-violet-100 p-6">
        <form action={action} className="space-y-5">
          {/* 제목 */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              제목 <span className="text-violet-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="판매할 물건 이름을 입력해주세요"
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
              defaultValue=""
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent transition bg-white"
            >
              <option value="" disabled>카테고리를 선택해주세요</option>
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
                placeholder="0"
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
              placeholder="물건에 대해 자세히 설명해주세요 (구매 시기, 사용 기간, 하자 여부 등)"
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
            {pending ? '등록 중...' : '판매글 등록하기'}
          </button>
        </form>
      </div>
    </div>
  )
}
