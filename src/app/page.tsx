'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Home() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [role, setRole] = useState<'STUDENT' | 'ADMIN'>('STUDENT')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }), // Login doesn't need role, purely email based in backend
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Login failed')
        return
      }

      // Redirect based on role
      if (data.user.role === 'ADMIN') {
        router.push('/admin/dashboard')
      } else {
        router.push('/student/dashboard')
      }
    } catch (err) {
      setError('Something went wrong')
    }
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>College Portal</h1>

        <div style={{ display: 'flex', marginBottom: '1rem', background: '#e5e7eb', padding: '0.25rem', borderRadius: '0.375rem' }}>
          <button
            type="button"
            className="btn"
            style={{ flex: 1, background: role === 'STUDENT' ? 'white' : 'transparent', color: role === 'STUDENT' ? 'black' : 'gray', boxShadow: role === 'STUDENT' ? '0 1px 2px 0 rgba(0,0,0,0.05)' : 'none' }}
            onClick={() => setRole('STUDENT')}
          >
            Student
          </button>
          <button
            type="button"
            className="btn"
            style={{ flex: 1, background: role === 'ADMIN' ? 'white' : 'transparent', color: role === 'ADMIN' ? 'black' : 'gray', boxShadow: role === 'ADMIN' ? '0 1px 2px 0 rgba(0,0,0,0.05)' : 'none' }}
            onClick={() => setRole('ADMIN')}
          >
            Teacher
          </button>
        </div>

        {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Email</label>
            <input
              type="email"
              required
              style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Password</label>
            <input
              type="password"
              required
              style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
            {role === 'ADMIN' ? 'Login as Teacher' : 'Login as Student'}
          </button>
        </form>

        {role === 'STUDENT' && (
          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
            New student? <Link href="/register" style={{ color: 'var(--primary)', fontWeight: 500 }}>Create an account</Link>
          </div>
        )}
      </div>
    </main>
  )
}
