'use client'

import { useState } from 'react'
import { syncCustomers } from './sync-action'

export default function SyncButton() {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  async function handleSync() {
    setLoading(true)
    setMsg('Syncing...')
    
    const res = await syncCustomers()
    if (res.error) setMsg(res.error)
    else setMsg(res.message || 'Synced!')
    
    setLoading(false)
    setTimeout(() => setMsg(''), 5000)
  }

  return (
    <div className="flex items-center gap-3">
      {msg && <span className="font-mono text-[9px] text-[#4ade80] tracking-widest uppercase">{msg}</span>}
      <button 
        onClick={handleSync}
        disabled={loading}
        className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted border border-border px-6 py-2.5 hover:bg-surface-muted hover:text-primary transition-colors bg-background"
      >
        {loading ? 'Syncing...' : 'Sync Data'}
      </button>
    </div>
  )
}
