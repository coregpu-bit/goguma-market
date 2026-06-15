'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

type ProductState = { error?: string } | undefined

export async function createProduct(state: ProductState, formData: FormData): Promise<ProductState> {
  const title = (formData.get('title') as string)?.trim()
  const description = (formData.get('description') as string)?.trim()
  const price = formData.get('price') as string
  const category = formData.get('category') as string
  const condition = formData.get('condition') as string

  if (!title || !description || !price || !category || !condition) {
    return { error: '모든 항목을 입력해주세요.' }
  }
  if (isNaN(Number(price)) || Number(price) < 0) {
    return { error: '가격을 올바르게 입력해주세요.' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: '로그인이 필요합니다.' }
  }

  const { error } = await supabase.from('products').insert({
    title,
    description,
    price: Number(price),
    category,
    condition,
    seller_id: user.id,
  })

  if (error) {
    return { error: '판매글 등록에 실패했습니다. 다시 시도해주세요.' }
  }

  redirect('/dashboard')
}

export async function updateProduct(state: ProductState, formData: FormData): Promise<ProductState> {
  const id = formData.get('id') as string
  const title = (formData.get('title') as string)?.trim()
  const description = (formData.get('description') as string)?.trim()
  const price = formData.get('price') as string
  const category = formData.get('category') as string
  const condition = formData.get('condition') as string

  if (!title || !description || !price || !category || !condition) {
    return { error: '모든 항목을 입력해주세요.' }
  }
  if (isNaN(Number(price)) || Number(price) < 0) {
    return { error: '가격을 올바르게 입력해주세요.' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: '로그인이 필요합니다.' }
  }

  const { error } = await supabase
    .from('products')
    .update({ title, description, price: Number(price), category, condition })
    .eq('id', id)
    .eq('seller_id', user.id)

  if (error) {
    return { error: '수정에 실패했습니다. 다시 시도해주세요.' }
  }

  redirect(`/products/${id}`)
}

export async function deleteProduct(id: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  await supabase.from('products').delete().eq('id', id).eq('seller_id', user.id)

  redirect('/products')
}
