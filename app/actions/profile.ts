'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

type ProfileState = { error?: string } | undefined

export async function updateProfile(state: ProfileState, formData: FormData): Promise<ProfileState> {
  const nickname = (formData.get('nickname') as string)?.trim()
  const bioRaw = (formData.get('bio') as string)?.trim()
  const avatarRaw = (formData.get('avatar_url') as string)?.trim()

  if (!nickname || nickname.length < 2) {
    return { error: '닉네임은 2자 이상 입력해주세요.' }
  }
  if (nickname.length > 20) {
    return { error: '닉네임은 20자 이내로 입력해주세요.' }
  }
  if (bioRaw && bioRaw.length > 300) {
    return { error: '자기소개는 300자 이내로 작성해주세요.' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '로그인이 필요해요.' }

  const { error } = await supabase
    .from('profiles')
    .update({
      nickname,
      bio: bioRaw || null,
      avatar_url: avatarRaw || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) return { error: '프로필 저장에 실패했어요. 다시 시도해주세요.' }

  // 네비게이션 바 등에서 쓰는 닉네임도 함께 갱신
  await supabase.auth.updateUser({ data: { nickname } })

  revalidatePath(`/profile/${user.id}`)
  redirect(`/profile/${user.id}`)
}
