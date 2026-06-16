'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function toggleLike(productId: string): Promise<{ liked: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { liked: false, error: '로그인이 필요해요.' }
  }

  const { data: existing } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase.from('likes').delete().eq('id', existing.id)
    if (error) return { liked: true, error: '잠시 후 다시 시도해주세요.' }
    revalidatePath(`/products/${productId}`)
    return { liked: false }
  }

  const { error } = await supabase
    .from('likes')
    .insert({ user_id: user.id, product_id: productId })
  if (error) return { liked: false, error: '잠시 후 다시 시도해주세요.' }

  revalidatePath(`/products/${productId}`)
  return { liked: true }
}
