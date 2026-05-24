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
      className="rounded-lg px-3 py-1.5 text-[10px] font-medium text-slate-600 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40"
      style={{ border: '1px solid transparent' }}
    >
      {pending ? 'Deleting…' : 'Delete'}
    </button>
  )
}
