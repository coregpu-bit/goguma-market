'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

const MAX_IMAGES = 5

export default function ImageUploader({ existingUrls = [] }: { existingUrls?: string[] }) {
  const [urls, setUrls] = useState<string[]>(existingUrls)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList) {
    const remaining = MAX_IMAGES - urls.length
    if (remaining <= 0) {
      setError(`사진은 최대 ${MAX_IMAGES}장까지 등록할 수 있어요.`)
      return
    }

    const toUpload = Array.from(files).slice(0, remaining)

    for (const file of toUpload) {
      if (file.size > 5 * 1024 * 1024) {
        setError('파일 크기는 5MB 이하여야 해요.')
        return
      }
      if (!file.type.startsWith('image/')) {
        setError('이미지 파일만 업로드할 수 있어요.')
        return
      }
    }

    setUploading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('로그인이 필요해요.')

      const newUrls: string[] = []
      for (const file of toUpload) {
        const ext = file.name.split('.').pop() ?? 'jpg'
        const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(path, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(path)

        newUrls.push(publicUrl)
      }

      setUrls(prev => [...prev, ...newUrls])
    } catch {
      setError('업로드에 실패했어요. 다시 시도해주세요.')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  function removeImage(index: number) {
    setUrls(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {urls.map((url, i) => (
          <div key={url} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 shrink-0">
            <img src={url} alt={`사진 ${i + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full text-xs hover:bg-black/80 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ))}

        {urls.length < MAX_IMAGES && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-20 h-20 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center gap-0.5 text-gray-400 hover:border-violet-300 hover:text-violet-400 transition disabled:opacity-50 shrink-0"
          >
            {uploading ? (
              <span className="text-[11px]">올리는 중…</span>
            ) : (
              <>
                <span className="text-2xl leading-none">+</span>
                <span className="text-[11px]">{urls.length}/{MAX_IMAGES}</span>
              </>
            )}
          </button>
        )}
      </div>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={e => e.target.files && handleFiles(e.target.files)}
      />

      {/* 폼 제출 시 URL 목록이 서버로 전달됨 */}
      {urls.map((url, i) => (
        <input key={i} type="hidden" name="image_urls" value={url} />
      ))}
    </div>
  )
}
