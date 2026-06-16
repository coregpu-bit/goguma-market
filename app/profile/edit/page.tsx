'use client'

import { useEffect, useState, useActionState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { updateProfile } from '@/app/actions/profile'
import { createClient } from '@/lib/supabase/client'
import AvatarUploader from '@/components/AvatarUploader'

type Profile = {
  id: string
  nickname: string
  bio: string | null
  avatar_url: string | null
}

export default function EditProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [state, action, pending] = useActionState(updateProfile, undefined)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.replace('/login')
        return
      }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
      setLoading(false)
    })
  }, [router])

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8 text-center text-gray-400">불러오는 중...</div>
    )
  }

  if (!profile) return null

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/profile/${profile.id}`} className="text-gray-400 hover:text-gray-600 transition-colors">
          ← 뒤로
        </Link>
        <h1 className="text-xl font-bold text-gray-900">프로필 수정</h1>
      </div>

      <div className="bg-white rounded-2xl border border-violet-100 p-6">
        <form action={action} className="space-y-5">
          {/* 프로필 사진 */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">프로필 사진</p>
            <AvatarUploader existingUrl={profile.avatar_url ?? ''} />
          </div>

          {/* 닉네임 */}
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">
              닉네임 <span className="text-violet-500">*</span>
            </label>
            <input
              id="nickname"
              name="nickname"
              type="text"
              defaultValue={profile.nickname}
              required
              minLength={2}
              maxLength={20}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent transition"
            />
          </div>

          {/* 자기소개 */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              자기소개
            </label>
            <textarea
              id="bio"
              name="bio"
              defaultValue={profile.bio ?? ''}
              rows={4}
              maxLength={300}
              placeholder="이웃들에게 나를 소개해보세요 (관심 분야, 거래 스타일 등)"
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
            {pending ? '저장 중...' : '저장하기'}
          </button>
        </form>
      </div>
    </div>
  )
}
