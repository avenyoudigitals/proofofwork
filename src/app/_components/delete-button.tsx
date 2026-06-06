'use client'

import { deleteWork } from '@/app/actions/work'
import { useTransition } from 'react'

export function DeleteButton({ workId }: { workId: string }) {
  const [pending, startTransition] = useTransition()

  function handleClick() {
    if (!confirm('Remove this submission? This cannot be undone.')) return
    startTransition(async () => {
      await deleteWork(workId)
    })
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={handleClick}
      className="rounded-lg px-3 py-1.5 text-[11px] font-medium transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40"
      style={{ border: '1px solid transparent', color: 'var(--text-3)', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font)' }}
    >
      {pending ? 'Deleting…' : 'Delete'}
    </button>
  )
}
