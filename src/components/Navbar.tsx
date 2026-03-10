'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Navbar() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        fetch('/api/auth/me')
            .then((res) => {
                if (res.ok) return res.json()
                return null
            })
            .then((data) => {
                if (data?.user) setUser(data.user)
            })
    }, [])

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        setUser(null)
        router.push('/')
        router.refresh()
    }

    if (!user) return null // Or return a public navbar

    return (
        <nav style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '1rem' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href={user.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'} style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                    College Portal
                </Link>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span>Welcome, {user.name}</span>
                    <button onClick={handleLogout} className="btn" style={{ backgroundColor: '#ef4444', color: 'white' }}>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    )
}
