'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
    const router = useRouter()
    const [courses, setCourses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddForm, setShowAddForm] = useState(false)
    const [formData, setFormData] = useState({ title: '', type: 'HONORS', description: '', totalSeats: 10 })
    const [message, setMessage] = useState('')

    const fetchCourses = () => {
        fetch('/api/courses')
            .then((res) => res.json())
            .then((data) => {
                setCourses(data)
                setLoading(false)
            })
    }

    useEffect(() => {
        fetch('/api/auth/me')
            .then((res) => {
                if (!res.ok) throw new Error('Not authenticated')
                return res.json()
            })
            .then((data) => {
                if (data.user.role !== 'ADMIN') throw new Error('Unauthorized')
                fetchCourses()
            })
            .catch(() => {
                router.push('/')
            })
    }, [router])

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this course?')) return
        await fetch(`/api/courses/${id}`, { method: 'DELETE' })
        fetchCourses()
    }

    const handleAddCourse = async (e: React.FormEvent) => {
        e.preventDefault()
        setMessage('')
        try {
            const res = await fetch('/api/courses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (!res.ok) {
                setMessage('Failed to add course')
                return
            }

            setFormData({ title: '', type: 'HONORS', description: '', totalSeats: 10 })
            setShowAddForm(false)
            fetchCourses()
        } catch (e) {
            setMessage('Error adding course')
        }
    }

    if (loading) return <div className="container" style={{ paddingTop: '2rem' }}>Loading...</div>

    return (
        <main className="container" style={{ paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '2rem 0' }}>
                <h1>Admin Dashboard</h1>
                <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
                    {showAddForm ? 'Cancel' : 'Add New Course'}
                </button>
            </div>

            {showAddForm && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3>Add New Course</h3>
                    {message && <p style={{ color: 'red' }}>{message}</p>}
                    <form onSubmit={handleAddCourse} style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Title</label>
                                <input required type="text" style={{ width: '100%', padding: '0.5rem' }} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Type</label>
                                <select style={{ width: '100%', padding: '0.5rem' }} value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                    <option value="HONORS">Honors</option>
                                    <option value="MINOR">Minor</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
                            <textarea required style={{ width: '100%', padding: '0.5rem' }} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Total Seats</label>
                            <input required type="number" min="1" style={{ width: '100%', padding: '0.5rem' }} value={formData.totalSeats} onChange={e => setFormData({ ...formData, totalSeats: Number(e.target.value) })} />
                        </div>
                        <button type="submit" className="btn btn-primary">Create Course</button>
                    </form>
                </div>
            )}

            <div className="card">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f9fafb', textAlign: 'left' }}>
                            <th style={{ padding: '0.75rem' }}>Title</th>
                            <th style={{ padding: '0.75rem' }}>Type</th>
                            <th style={{ padding: '0.75rem' }}>Seats</th>
                            <th style={{ padding: '0.75rem' }}>Status</th>
                            <th style={{ padding: '0.75rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map(course => (
                            <tr key={course.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '0.75rem' }}>{course.title}</td>
                                <td style={{ padding: '0.75rem' }}>
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
                                </td>
                                <td style={{ padding: '0.75rem' }}>{course.takenSeats} / {course.totalSeats}</td>
                                <td style={{ padding: '0.75rem' }}>{course.takenSeats >= course.totalSeats ? 'Full' : 'Open'}</td>
                                <td style={{ padding: '0.75rem' }}>
                                    <button onClick={() => handleDelete(course.id)} style={{ color: '#ef4444', textDecoration: 'underline', background: 'none' }}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {courses.length === 0 && <p style={{ padding: '1rem', textAlign: 'center', color: 'gray' }}>No courses available.</p>}
            </div>
        </main>
    )
}
