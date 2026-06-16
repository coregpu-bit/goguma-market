'use client'

import { useState } from 'react'

export default function ImageGallery({ urls }: { urls: string[] }) {
  const [current, setCurrent] = useState(0)

  return (
    <div>
      <div className="w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
        <img
          src={urls[current]}
          alt={`상품 이미지 ${current + 1}`}
          className="max-w-full max-h-full object-contain"
        />
      </div>
      {urls.length > 1 && (
        <div className="flex gap-2 p-3 overflow-x-auto bg-gray-50">
          {urls.map((url, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                i === current ? 'border-violet-500' : 'border-gray-200 hover:border-violet-300'
              }`}
            >
              <img src={url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
