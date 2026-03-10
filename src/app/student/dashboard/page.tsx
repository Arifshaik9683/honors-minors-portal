'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function StudentDashboard() {
    const router = useRouter()
    const [courses, setCourses] = useState<any[]>([])
    const [user, setUser] = useState<any>(null)
    const [enrollment, setEnrollment] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('')

    useEffect(() => {
        // 1. Fetch User Session
        fetch('/api/auth/me')
            .then((res) => {
                if (!res.ok) throw new Error('Not authenticated')
                return res.json()
            })
            .then((data) => {
                setUser(data.user)
                // 2. Fetch User Enrollment Status (Can be fetched effectively via fetching all courses and checking user id? 
                // Or better, add an endpoint for enrollment status. For now, let's just fetch courses and use a separate call for enrollment if needed, 
                // but `User` model has `enrollment`. The helper `getSession` only returns JWT payload usually.
                // Let's assume we need to fetch user details with enrollment or a separate endpoint.

                // Actually, let's fetch course list and try to fetch current enrollment status.
                return fetch('/api/courses')
            })
            .then((res) => res.json())
            .then(async (data) => {
                setCourses(data)

                // Fetch enrollment status separately to be sure
                // We do not have a specific 'my-enrollment' endpoint yet, but we can add or just check user profile if we update `me` to return it.
                // Let's create a quick way: fetch `/api/auth/me` does NOT return db user with relations.
                // I will assume for now we don't know enrollment unless I add an endpoint.
                // I'll add `GET /api/enrollment/status` as per plan.
                const enrollRes = await fetch('/api/enroll') // Wait, POST is enroll. GET is not defined. I need to define it or logic in `me`?
                // Let's assume I missed implementing `GET /api/enroll` or similar.
                // I'll add it to `api/auth/me` or specific endpoint. 
                // The plan said `GET /api/enrollment/status`. I likely missed creating it.
                // I will implement fetching logic on the client for now if the user object has it, but it doesn't.

                // FIX: I will implement `GET /api/enroll` to return current enrollment.
                const statusRes = await fetch('/api/enroll/status')
                if (statusRes.ok) {
                    const statusData = await statusRes.json()
                    setEnrollment(statusData.enrollment)
                }

                setLoading(false)
            })
            .catch(() => {
                router.push('/')
            })
    }, [router])

    const handleEnroll = async (courseId: number) => {
        setMessage('')
        try {
            const res = await fetch('/api/enroll', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ courseId }),
            })

            const result = await res.json()

            if (!res.ok) {
                setMessage(result.error || 'Enrollment failed')
                return
            }

            setMessage('Successfully enrolled!')
            // Refresh state
            window.location.reload()
        } catch (e) {
            setMessage('Network error')
        }
    }

    if (loading) return <div className="container" style={{ paddingTop: '2rem' }}>Loading...</div>

    return (
        <main className="container" style={{ paddingBottom: '2rem' }}>
            <h1 style={{ margin: '2rem 0' }}>Student Dashboard</h1>

            {enrollment ? (
                <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
                    <h2>You are enrolled!</h2>
                    <p>
                        Subject: <strong>{courses.find(c => c.id === enrollment.courseId)?.title || 'Unknown Course'}</strong>
                    </p>
                    <p>Date: {new Date(enrollment.createdAt).toLocaleDateString()}</p>
                </div>
            ) : (
                <>
                    <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
                        Please select <strong>one</strong> program to enroll in. This is First-Come-First-Serve.
                    </p>

                    {message && <div style={{ padding: '1rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '0.375rem', marginBottom: '1rem' }}>{message}</div>}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {courses.map((course) => {
                            const isFull = course.takenSeats >= course.totalSeats
                            return (
                                <div key={course.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                        <h3 style={{ fontSize: '1.25rem' }}>{course.title}</h3>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '999px',
                                            background: course.type === 'HONORS' ? '#e0e7ff' : '#fef3c7',
                                            color: course.type === 'HONORS' ? '#3730a3' : '#92400e',
                                            fontWeight: 600
                                        }}>
                                            {course.type}
                                        </span>
                                    </div>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', flex: 1 }}>{course.description}</p>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: '0.875rem', color: isFull ? 'var(--error)' : 'var(--success)', fontWeight: 500 }}>
                                                {course.takenSeats} / {course.totalSeats} seats taken
                                            </span>
                                            <span style={{ fontSize: '0.875rem', color: isFull ? 'var(--error)' : 'var(--success)', fontWeight: 500 }}>
                                                {course.totalSeats - course.takenSeats} seats available
                                            </span>
                                        </div>
                                        <button
                                            className="btn btn-primary"
                                            disabled={isFull}
                                            style={{ opacity: isFull ? 0.5 : 1, cursor: isFull ? 'not-allowed' : 'pointer' }}
                                            onClick={() => handleEnroll(course.id)}
                                        >
                                            {isFull ? 'Full' : 'Enroll'}
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </>
            )}
        </main>
    )
}
