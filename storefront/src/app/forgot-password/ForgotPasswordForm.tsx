'use client'

import { useState } from 'react'
import { resetPassword } from '../login/actions'

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    const result = await resetPassword(email)
    
    if (result?.error) {
      setError(result.error)
    } else {
      setMessage('Recovery link sent! Please check your email.')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.15em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Email Address
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        {loading ? 'Sending...' : 'Send Recovery Link'}
      </button>

      {message && (
        <div style={{ padding: '12px 16px', background: 'rgba(90,196,120,0.08)', border: '1px solid rgba(90,196,120,0.2)', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--green)', textAlign: 'center' }}>
          {message}
        </div>
      )}

      {error && (
        <div style={{ padding: '12px 16px', background: 'rgba(196,90,90,0.08)', border: '1px solid rgba(196,90,90,0.2)', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--red)', textAlign: 'center' }}>
          {error}
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '12px' }}>
        <a href="/login" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--gold)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          ← Back to Login
        </a>
      </div>
    </form>
  )
}
