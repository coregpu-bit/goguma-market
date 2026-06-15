'use client'

import Link from 'next/link'
import { deleteProduct } from '@/app/actions/product'

export default function ProductActions({ productId }: { productId: string }) {
  async function handleDelete() {
    if (!confirm('정말 삭제하시겠어요?')) return
    await deleteProduct(productId)
  }

  return (
    <div className="flex gap-2">
      <Link
        href={`/products/${productId}/edit`}
        className="px-4 py-2 text-sm font-semibold border border-violet-300 text-violet-600 rounded-xl hover:bg-violet-50 transition-colors"
      >
        수정
      </Link>
      <button
        onClick={handleDelete}
        className="px-4 py-2 text-sm font-semibold border border-red-200 text-red-500 rounded-xl hover:bg-red-50 transition-colors"
      >
        삭제
      </button>
    </div>
  )
}
