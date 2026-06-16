'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AvatarUploader({ existingUrl = '' }: { existingUrl?: string }) {
  const [url, setUrl] = useState(existingUrl)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    if (file.size > 2 * 1024 * 1024) {
      setError('파일 크기는 2MB 이하여야 해요.')
      return
    }
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드할 수 있어요.')
      return
    }

    setUploading(true)
    setError(null)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('로그인이 필요해요.')

      const ext = file.name.split('.').pop() ?? 'jpg'
      const path = `${user.id}/${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage.from('avatars').upload(path, file)
      if (upErr) throw upErr

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
      setUrl(publicUrl)
    } catch {
      setError('업로드에 실패했어요. 다시 시도해주세요.')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="w-20 h-20 rounded-full overflow-hidden bg-violet-100 flex items-center justify-center shrink-0">
        {url ? (
          <img src={url} alt="프로필 사진" className="w-full h-full object-cover" />
        ) : (
          <span className="text-3xl">🍠</span>
        )}
      </div>

      <div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="px-3 py-1.5 text-sm font-medium border border-violet-300 text-violet-600 rounded-xl hover:bg-violet-50 disabled:opacity-60 transition-colors"
          >
            {uploading ? '올리는 중…' : '사진 변경'}
          </button>
          {url && (
            <button
              type="button"
              onClick={() => setUrl('')}
              className="text-sm text-gray-400 hover:text-red-400"
            >
              삭제
            </button>
          )}
        </div>
        {error ? (
          <p className="text-xs text-red-500 mt-1">{error}</p>
        ) : (
          <p className="text-xs text-gray-400 mt-1">JPG/PNG · 2MB 이하</p>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      <input type="hidden" name="avatar_url" value={url} />
    </div>
  )
}
