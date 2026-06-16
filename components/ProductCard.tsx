import Link from 'next/link'

type Product = {
  id: string
  title: string
  price: number
  category: string
  condition: string
  status: string
  created_at: string
  image_urls: string[] | null
}

const POSTIT_BG = [
  'bg-yellow-50',
  'bg-pink-50',
  'bg-emerald-50',
  'bg-sky-50',
  'bg-violet-50',
  'bg-orange-50',
]

const ROTATE = ['-rotate-2', 'rotate-1', 'rotate-2', '-rotate-1']

const CATEGORY_EMOJI: Record<string, string> = {
  '디지털/가전': '💻',
  '의류/잡화': '👗',
  '가구/인테리어': '🪑',
  '도서/음반': '📚',
  '스포츠/레저': '⚽',
  '생활/주방': '🍳',
  '기타': '📦',
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return '방금 전'
  if (minutes < 60) return `${minutes}분 전`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}시간 전`
  return `${Math.floor(hours / 24)}일 전`
}

export default function ProductCard({ product, index }: { product: Product; index: number }) {
  const bg = POSTIT_BG[index % POSTIT_BG.length]
  const rotate = ROTATE[index % ROTATE.length]
  const emoji = CATEGORY_EMOJI[product.category] ?? '📦'

  return (
    <Link
      href={`/products/${product.id}`}
      className={`relative block ${bg} ${rotate} rounded-sm p-4 shadow-md hover:rotate-0 hover:-translate-y-2 hover:shadow-xl transition-all duration-200`}
    >
      {/* 테이프 */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-5 bg-white/70 rounded-sm shadow-sm" />

      {/* 상태 배지 */}
      {product.status !== '판매중' && (
        <span className="absolute top-2 right-2 text-[10px] bg-black/10 text-gray-600 px-1.5 py-0.5 rounded-full font-medium">
          {product.status}
        </span>
      )}

      {/* 대표 사진 또는 카테고리 이모지 */}
      {product.image_urls?.[0] ? (
        <div className="overflow-hidden rounded-md">
          <img
            src={product.image_urls[0]}
            alt={product.title}
            className="w-full h-24 object-cover"
          />
        </div>
      ) : (
        <div className="text-5xl text-center py-3">
          {emoji}
        </div>
      )}

      {/* 내용 */}
      <div className="mt-1 space-y-0.5">
        <p className="font-semibold text-gray-800 text-sm line-clamp-2 leading-snug">{product.title}</p>
        <p className="font-bold text-gray-900 text-sm">{product.price.toLocaleString()}원</p>
        <p className="text-xs text-gray-400">{product.category} · {timeAgo(product.created_at)}</p>
      </div>
    </Link>
  )
}
