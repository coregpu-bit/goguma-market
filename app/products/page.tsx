import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'

export default async function ProductsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: products } = await supabase
    .from('products')
    .select('id, title, price, category, condition, status, created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">중고 거래</h1>
        <Link
          href="/sell"
          className="px-4 py-2 bg-violet-600 text-white rounded-full text-sm font-semibold hover:bg-violet-700 transition-colors"
        >
          + 판매글 쓰기
        </Link>
      </div>

      {!products || products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-4">🍠</div>
          <p className="text-gray-500 font-medium">아직 등록된 판매글이 없어요</p>
          <p className="text-sm text-gray-400 mt-1">첫 번째로 물건을 올려보세요!</p>
          <Link
            href="/sell"
            className="mt-6 px-6 py-2.5 bg-violet-600 text-white rounded-full text-sm font-semibold hover:bg-violet-700 transition-colors"
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
  )
}
