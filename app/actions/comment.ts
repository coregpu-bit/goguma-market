'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { User } from '@supabase/supabase-js'

type CommentState = { error?: string }

const MAX_LEN = 500

function displayName(user: User): string {
  return (user.user_metadata?.nickname as string) ?? user.email?.split('@')[0] ?? '이웃'
}

export async function createComment(productId: string, content: string): Promise<CommentState> {
  const trimmed = content.trim()
  if (!trimmed) return { error: '내용을 입력해주세요.' }
  if (trimmed.length > MAX_LEN) return { error: `댓글은 ${MAX_LEN}자 이내로 작성해주세요.` }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '로그인이 필요해요.' }

  const { error } = await supabase.from('comments').insert({
    product_id: productId,
    user_id: user.id,
    author_name: displayName(user),
    content: trimmed,
  })
  if (error) return { error: '댓글 등록에 실패했어요. 다시 시도해주세요.' }

  revalidatePath(`/products/${productId}`)
  return {}
}

export async function createReply(parentId: string, content: string): Promise<CommentState> {
  const trimmed = content.trim()
  if (!trimmed) return { error: '내용을 입력해주세요.' }
  if (trimmed.length > MAX_LEN) return { error: `답글은 ${MAX_LEN}자 이내로 작성해주세요.` }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '로그인이 필요해요.' }

  // 원댓글 확인 — 답글의 답글은 허용하지 않음
  const { data: parent } = await supabase
    .from('comments')
    .select('id, product_id, parent_id')
    .eq('id', parentId)
    .single()
  if (!parent || parent.parent_id) return { error: '답글을 달 수 없는 댓글이에요.' }

  // 판매자 본인인지 확인
  const { data: product } = await supabase
    .from('products')
    .select('seller_id')
    .eq('id', parent.product_id)
    .single()
  if (!product || product.seller_id !== user.id) {
    return { error: '판매자만 답글을 달 수 있어요.' }
  }

  const { error } = await supabase.from('comments').insert({
    product_id: parent.product_id,
    user_id: user.id,
    parent_id: parentId,
    author_name: displayName(user),
    content: trimmed,
  })
  if (error) return { error: '답글 등록에 실패했어요. 다시 시도해주세요.' }

  revalidatePath(`/products/${parent.product_id}`)
  return {}
}

export async function updateComment(commentId: string, content: string): Promise<CommentState> {
  const trimmed = content.trim()
  if (!trimmed) return { error: '내용을 입력해주세요.' }
  if (trimmed.length > MAX_LEN) return { error: `${MAX_LEN}자 이내로 작성해주세요.` }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '로그인이 필요해요.' }

  const { data, error } = await supabase
    .from('comments')
    .update({ content: trimmed, updated_at: new Date().toISOString() })
    .eq('id', commentId)
    .eq('user_id', user.id)
    .select('product_id')
    .single()
  if (error || !data) return { error: '수정에 실패했어요. 다시 시도해주세요.' }

  revalidatePath(`/products/${data.product_id}`)
  return {}
}

export async function deleteComment(commentId: string): Promise<CommentState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '로그인이 필요해요.' }

  const { data, error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', user.id)
    .select('product_id')
    .single()
  if (error || !data) return { error: '삭제에 실패했어요. 다시 시도해주세요.' }

  revalidatePath(`/products/${data.product_id}`)
  return {}
}
