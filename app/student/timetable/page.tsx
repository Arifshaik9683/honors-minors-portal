"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Storage } from "../../utils/storage";

const formatTime = (timeString: string) => {
    if (!timeString) return "-";
    try {
        const [h, m] = timeString.split(':');
        let hours = parseInt(h, 10);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const minutes = m || '00';
        return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
    } catch {
        return timeString;
    }
};

const parseTimetable = (ttString: string) => {
    if (!ttString) return [];
    try {
        const parsed = JSON.parse(ttString);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

export default function Timetable() {
    const router = useRouter();
    const [courses, setCourses] = useState<any[]>([]);
    const [enrolledCourseId, setEnrolledCourseId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Storage.initialize();

        const role = localStorage.getItem("userRole");
        const student = JSON.parse(localStorage.getItem("student") || "{}");

        if (!student.email || role !== "student") {
            router.push("/student");
            return;
        }

        // Get student's enrolled course
        const allStudents = Storage.getStudents();
        const currentStudent = allStudents.find((s: any) => s.email === student.email);

        if (currentStudent && currentStudent.enrolledSubjectId) {
            setEnrolledCourseId(currentStudent.enrolledSubjectId);
        } else if (student.enrolledSubjectId) {
            setEnrolledCourseId(student.enrolledSubjectId);
        }

        const fetchCourses = async () => {
            try {
                const res = await fetch('/api/admin/courses');
                const data = await res.json();
                setCourses(data);
                setLoading(false);
            } catch (e) {
                console.error(e);
                setLoading(false);
            }
        };
        fetchCourses();
    }, [router]);

    const logout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            localStorage.removeItem("student");
            localStorage.removeItem("userRole");
            localStorage.removeItem("userEmail");
            router.push("/");
        }
    };

    if (loading) return <div style={styles.loading}>Loading timetable...</div>;

    const enrolledCourse = courses.find(c => String(c.id) === String(enrolledCourseId));
    const parsedTimetable = parseTimetable(enrolledCourse?.timetable);

    return (
        <div style={styles.container}>
            {/* Background Blobs */}
            <div className="animate-blob" style={{ position: "absolute", top: "10%", left: "5%", width: "400px", height: "400px", background: "rgba(37, 99, 235, 0.1)", borderRadius: "50%", filter: "blur(80px)", zIndex: 0 }}></div>
            <div className="animate-blob animation-delay-2000" style={{ position: "absolute", bottom: "10%", right: "5%", width: "300px", height: "300px", background: "rgba(147, 51, 234, 0.1)", borderRadius: "50%", filter: "blur(80px)", zIndex: 0 }}></div>

            <nav style={styles.navbar} className="flex-col sm:flex-row gap-4 py-4 px-4 sm:px-[5%]">
                <div style={styles.navBrand}>Student Portal</div>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <button onClick={() => router.push('/student/enroll')} style={{ ...styles.actionBtn, color: '#2563eb', borderColor: '#2563eb' }} className="hover-scale text-sm sm:text-base">
                        Back to Enroll
                    </button>
                    <button onClick={logout} style={{ ...styles.actionBtn, color: '#ef4444', borderColor: '#ef4444' }} className="hover-scale text-sm sm:text-base">
                        Logout
                    </button>
                </div>
            </nav>

            <main style={{ ...styles.main, position: "relative", zIndex: 1 }} className="px-4 py-10 sm:py-[60px] sm:px-[5%]">
                <header style={styles.header} className="animate-slide-up">
                    <h1 style={styles.title} className="text-3xl sm:text-[42px]">Your Timetable</h1>
                    <p style={styles.subtitle}>
                        View the schedule for your enrolled subjects. More details will be added soon.
                    </p>
                </header>

                <div style={styles.content} className="animate-slide-up">
                    {enrolledCourse ? (
                        <div style={styles.card}>
                            <h2 style={styles.courseName}>{enrolledCourse.name}</h2>
                            <p style={styles.faculty}><strong>Instructor:</strong> {enrolledCourse.faculty}</p>

                            <div style={{ marginTop: '20px', padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <h3 style={{ fontSize: '18px', color: '#1e293b', marginBottom: '15px' }}>Weekly Schedule</h3>
                                {parsedTimetable.length > 0 ? (
                                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                                        <table className="w-full table-auto border-collapse bg-white">
                                            <thead>
                                                <tr className="bg-gray-100 text-slate-700">
                                                    <th className="py-3 px-4 border-b border-gray-200 font-semibold text-center">Day</th>
                                                    <th className="py-3 px-4 border-b border-gray-200 font-semibold text-center">Start Time</th>
                                                    <th className="py-3 px-4 border-b border-gray-200 font-semibold text-center">End Time</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {parsedTimetable.map((row: any, idx: number) => (
                                                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                                        <td className="py-3 px-4 border-b border-gray-100 text-center text-slate-600">{row.day || "-"}</td>
                                                        <td className="py-3 px-4 border-b border-gray-100 text-center text-slate-600">{formatTime(row.start)}</td>
                                                        <td className="py-3 px-4 border-b border-gray-100 text-center text-slate-600">{formatTime(row.end)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p style={{ color: '#64748b', fontSize: '15px', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>
                                        No timetable available
                                    </p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div style={styles.card}>
                            <h2 style={styles.courseName}>No Enrollment Found</h2>
                            <p style={styles.description}>You are not enrolled in any Honors/Minors course yet. Please go to the Enroll page to select a course first.</p>
                            <button
                                onClick={() => router.push('/student/enroll')}
                                style={styles.enrollBtn}
                                className="hover-scale"
                            >
                                Go to Enroll Page
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

const styles = {
    // Reused standard styles from enrolled page for consistency
    container: {
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "'Inter', sans-serif",
        position: "relative" as const,
        overflow: "hidden" as const,
    },
    navbar: {
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(10px)",
        // Tailwind handles padding
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 20px rgba(0,0,0,0.03)",
        position: "sticky" as const,
        top: 0,
        zIndex: 50,
        borderBottom: "1px solid rgba(0,0,0,0.05)",
    },
    navBrand: {
        fontSize: 20,
        fontWeight: 700,
        background: "linear-gradient(90deg, #2563eb, #9333ea)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
    },
    actionBtn: {
        padding: "8px 20px",
        background: "transparent",
        border: "1px solid",
        borderRadius: 50,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s",
    },
    main: {
        // Tailwind handles padding
        maxWidth: 900,
        margin: "0 auto",
    },
    header: {
        textAlign: "center" as const,
        marginBottom: 40,
    },
    title: {
        fontWeight: 800,
        color: "#0f172a",
        marginBottom: 15,
        letterSpacing: "-1px",
    },
    subtitle: {
        fontSize: 18,
        color: "#64748b",
        maxWidth: 600,
        margin: "0 auto",
        lineHeight: 1.6,
    },
    content: {
        display: "flex",
        flexDirection: "column" as const,
        gap: 20,
    },
    card: {
        background: "white",
        borderRadius: 24,
        padding: 40,
        boxShadow: "0 10px 30px rgba(37, 99, 235, 0.05)",
        border: "1px solid rgba(0,0,0,0.05)",
    },
    courseName: {
        fontSize: 26,
        fontWeight: 700,
        color: "#1e293b",
        marginBottom: 15,
    },
    faculty: {
        fontSize: 16,
        color: "#475569",
        marginBottom: 30,
        paddingBottom: 20,
        borderBottom: "1px dashed #e2e8f0",
    },
    description: {
        fontSize: 16,
        color: "#64748b",
        lineHeight: 1.7,
        marginBottom: 30,
    },
    timetableGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "10px",
        background: "#f8fafc",
        padding: "20px",
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
    },
    tableHeader: {
        fontWeight: 700,
        color: "#1e293b",
        paddingBottom: "10px",
        borderBottom: "2px solid #cbd5e1",
    },
    tableCell: {
        padding: "12px 0",
        color: "#475569",
        fontSize: "15px",
        borderBottom: "1px solid #e2e8f0",
    },
    enrollBtn: {
        padding: "16px 30px",
        border: "none",
        borderRadius: 12,
        background: "#2563eb",
        color: "white",
        fontWeight: 600,
        fontSize: 16,
        cursor: "pointer",
        display: "inline-block",
        boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)",
    },
    loading: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: 18,
        color: "#64748b",
        background: "#f8fafc",
    },
};
