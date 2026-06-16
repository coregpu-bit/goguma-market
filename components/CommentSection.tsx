'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  createComment,
  createReply,
  updateComment,
  deleteComment,
} from '@/app/actions/comment'

export type CommentRow = {
  id: string
  user_id: string
  parent_id: string | null
  author_name: string
  content: string
  created_at: string
  updated_at: string
}

export type Thread = CommentRow & { replies: CommentRow[] }

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return '방금 전'
  if (minutes < 60) return `${minutes}분 전`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}시간 전`
  return `${Math.floor(hours / 24)}일 전`
}

function CommentItem({
  comment,
  sellerId,
  currentUserId,
  isReply = false,
  canReply = false,
}: {
  comment: CommentRow
  sellerId: string
  currentUserId: string | null
  isReply?: boolean
  canReply?: boolean
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [editing, setEditing] = useState(false)
  const [replying, setReplying] = useState(false)
  const [editText, setEditText] = useState(comment.content)
  const [replyText, setReplyText] = useState('')
  const [error, setError] = useState<string | null>(null)

  const isAuthor = currentUserId === comment.user_id
  const isSellerComment = comment.user_id === sellerId
  const edited = comment.updated_at !== comment.created_at

  function handleEdit() {
    setError(null)
    startTransition(async () => {
      const res = await updateComment(comment.id, editText)
      if (res.error) return setError(res.error)
      setEditing(false)
      router.refresh()
    })
  }

  function handleDelete() {
    if (!confirm('댓글을 삭제할까요? 답글도 함께 삭제돼요.')) return
    setError(null)
    startTransition(async () => {
      const res = await deleteComment(comment.id)
      if (res.error) return setError(res.error)
      router.refresh()
    })
  }

  function handleReply() {
    setError(null)
    startTransition(async () => {
      const res = await createReply(comment.id, replyText)
      if (res.error) return setError(res.error)
      setReplyText('')
      setReplying(false)
      router.refresh()
    })
  }

  return (
    <div className={isReply ? 'pl-4 border-l-2 border-violet-100' : ''}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm font-semibold text-gray-800">{comment.author_name}</span>
        {isSellerComment && (
          <span className="text-[10px] bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded-full font-medium">
            판매자
          </span>
        )}
        <span className="text-xs text-gray-400">
          {timeAgo(comment.created_at)}{edited && ' · 수정됨'}
        </span>
      </div>

      {editing ? (
        <div className="space-y-2">
          <textarea
            value={editText}
            onChange={e => setEditText(e.target.value)}
            rows={2}
            maxLength={500}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent transition resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              disabled={pending}
              className="px-3 py-1.5 text-xs font-semibold bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-60 transition-colors"
            >
              저장
            </button>
            <button
              onClick={() => { setEditing(false); setEditText(comment.content); setError(null) }}
              className="px-3 py-1.5 text-xs font-semibold border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{comment.content}</p>
      )}

      {!editing && (
        <div className="flex items-center gap-3 mt-1">
          {canReply && (
            <button
              onClick={() => setReplying(v => !v)}
              className="text-xs text-violet-500 hover:text-violet-600 font-medium"
            >
              답글
            </button>
          )}
          {isAuthor && (
            <>
              <button
                onClick={() => setEditing(true)}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                수정
              </button>
              <button
                onClick={handleDelete}
                disabled={pending}
                className="text-xs text-gray-400 hover:text-red-400 disabled:opacity-60"
              >
                삭제
              </button>
            </>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

      {replying && (
        <div className="mt-2 space-y-2">
          <textarea
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            rows={2}
            maxLength={500}
            placeholder="판매자 답글을 남겨주세요"
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent transition resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={handleReply}
              disabled={pending}
              className="px-3 py-1.5 text-xs font-semibold bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-60 transition-colors"
            >
              답글 등록
            </button>
            <button
              onClick={() => { setReplying(false); setReplyText(''); setError(null) }}
              className="px-3 py-1.5 text-xs font-semibold border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function CommentSection({
  productId,
  sellerId,
  currentUserId,
  comments,
}: {
  productId: string
  sellerId: string
  currentUserId: string | null
  comments: Thread[]
}) {
  const router = useRouter()
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const total = comments.reduce((n, c) => n + 1 + c.replies.length, 0)
  const isSeller = currentUserId === sellerId

  function handleSubmit() {
    setError(null)
    startTransition(async () => {
      const res = await createComment(productId, text)
      if (res.error) return setError(res.error)
      setText('')
      router.refresh()
    })
  }

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-500 mb-3">댓글 {total}</h2>

      {currentUserId ? (
        <div className="mb-5 space-y-2">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="궁금한 점이나 거래 문의를 남겨보세요"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent transition resize-none"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={pending}
              className="px-4 py-2 text-sm font-semibold bg-violet-600 text-white rounded-xl hover:bg-violet-700 disabled:opacity-60 transition-colors"
            >
              {pending ? '등록 중...' : '댓글 등록'}
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-5 bg-violet-50 rounded-xl px-4 py-3 text-sm text-gray-500">
          <Link href="/login" className="text-violet-600 font-medium hover:underline">로그인</Link>
          하고 댓글을 남겨보세요.
        </div>
      )}

      {comments.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">아직 댓글이 없어요. 첫 댓글을 남겨보세요!</p>
      ) : (
        <ul className="space-y-5">
          {comments.map(comment => (
            <li key={comment.id} className="space-y-3">
              <CommentItem
                comment={comment}
                sellerId={sellerId}
                currentUserId={currentUserId}
                canReply={isSeller}
              />
              {comment.replies.length > 0 && (
                <div className="space-y-3">
                  {comment.replies.map(reply => (
                    <CommentItem
                      key={reply.id}
                      comment={reply}
                      sellerId={sellerId}
                      currentUserId={currentUserId}
                      isReply
                    />
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
