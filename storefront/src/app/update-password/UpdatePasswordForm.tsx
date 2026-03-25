'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function UpdatePasswordForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.updateUser({
      password: password
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/login?message=Password updated successfully')
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.15em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          New Password
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            background: 'var(--obsidian)',
            border: '1px solid var(--border)',
            borderBottom: '1px solid var(--border-gold)',
            color: 'var(--text)',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            padding: '12px 16px',
            outline: 'none',
            width: '100%',
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.15em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Confirm Password
        </label>
        <input
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={{
            background: 'var(--obsidian)',
            border: '1px solid var(--border)',
            borderBottom: '1px solid var(--border-gold)',
            color: 'var(--text)',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            padding: '12px 16px',
            outline: 'none',
            width: '100%',
          }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary"
        style={{ width: '100%', letterSpacing: '0.2em' }}
      >
        {loading ? 'Updating...' : 'Set New Password'}
      </button>

      {error && (
        <div style={{ padding: '12px 16px', background: 'rgba(196,90,90,0.08)', border: '1px solid rgba(196,90,90,0.2)', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--red)', textAlign: 'center' }}>
          {error}
        </div>
      )}
    </form>
  )
}
