"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Storage } from "../../utils/storage";

export default function Enroll() {
    const router = useRouter();
    const [courses, setCourses] = useState<any[]>([]);
    const [enrolledCourseId, setEnrolledCourseId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    const [statusMessage, setStatusMessage] = useState<{ text: string, type: 'error' | 'success' | 'info' } | null>(null);
    const [warningMessage, setWarningMessage] = useState("");

    useEffect(() => {
        // Route protection
        const role = localStorage.getItem("userRole");
        const student = JSON.parse(localStorage.getItem("student") || "{}");

        if (!student.email || role !== "student") {
            router.push("/student");
            return;
        }

        const fetchCourses = async () => {
            try {
                const res = await fetch('/api/admin/courses');
                const data = await res.json();
                setCourses(data);
                console.log("Courses:", data);
                setLoading(false);
            } catch (e) {
                console.error(e);
                setLoading(false);
            }
        };
        fetchCourses();

        // Fetch LIVE student enrollment asynchronously via DB poll natively covering blank slate/0 setup
        const fetchEnrollment = async () => {
            try {
                if (!student.email) return;
                const envRes = await fetch(`/api/student/enrollment?email=${encodeURIComponent(student.email)}`);
                const envData = await envRes.json();
                
                if (envData && envData.courseId) {
                    setEnrolledCourseId(envData.courseId);
                } else if (student.enrolledSubjectId) {
                    setEnrolledCourseId(student.enrolledSubjectId);
                } else {
                    setEnrolledCourseId(null);
                }
                
                console.log("Enrollment (envData):", envData);
            } catch (err) {
                console.error("Failed to fetch enrollment", err);
            }
        };
        fetchEnrollment();
    }, [router]);

    const enroll = async (course: any) => {
        const student = JSON.parse(localStorage.getItem("student") || "{}");

        if (!student.email) return;

        const hasActiveEnrollment = !!enrolledCourseId && enrolledCourseId !== "null" && enrolledCourseId !== "undefined";

        if (hasActiveEnrollment && String(course.id) !== String(enrolledCourseId)) {
            setWarningMessage("If you want to leave or change your course, please contact college authorities.");
            setTimeout(() => setWarningMessage(""), 5000);
            return;
        }

        const confirmEnroll = window.confirm(`Enroll in ${course.name}?`);
        if (!confirmEnroll) return;

        try {
            const res = await fetch('/api/student/enroll', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentEmail: student.email, courseId: course.id })
            });

            const result = await res.json();

            if (result.success) {
                setEnrolledCourseId(course.id);

                // Keep UI session in sync
                student.enrolledSubjectId = course.id;
                localStorage.setItem("student", JSON.stringify(student));

                setStatusMessage({ text: `Successfully enrolled in ${course.name} 🎉`, type: 'success' });
                // Refresh courses to update seat count in UI
                const coursesRes = await fetch('/api/admin/courses');
                const updatedCourses = await coursesRes.json();
                setCourses(updatedCourses);
            } else {
                setStatusMessage({ text: result.message + " ❌", type: 'error' });
            }
        } catch (e) {
            setStatusMessage({ text: "Network Error ❌", type: 'error' });
        }

        setTimeout(() => setStatusMessage(null), 3000);
    };

    const dropCourse = () => {
        setStatusMessage({ text: "To drop this course, please contact the college authorities. 🏛️", type: "info" });
        setTimeout(() => setStatusMessage(null), 3000);
    };

    const logout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            localStorage.removeItem("student");
            localStorage.removeItem("userRole");
            localStorage.removeItem("userEmail");
            router.push("/");
        }
    };

    if (loading) return <div style={styles.loading}>Loading courses...</div>;

    return (
        <div style={styles.container}>
            {/* Background Blobs */}
            <div className="animate-blob" style={{ position: "absolute", top: "10%", left: "5%", width: "400px", height: "400px", background: "rgba(37, 99, 235, 0.1)", borderRadius: "50%", filter: "blur(80px)", zIndex: 0 }}></div>
            <div className="animate-blob animation-delay-2000" style={{ position: "absolute", bottom: "10%", right: "5%", width: "300px", height: "300px", background: "rgba(147, 51, 234, 0.1)", borderRadius: "50%", filter: "blur(80px)", zIndex: 0 }}></div>

            <nav style={styles.navbar} className="flex-col sm:flex-row gap-4 py-4 px-4 sm:px-[5%]">
                <div style={styles.navBrand}>Student Portal</div>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <button onClick={() => router.push('/student/timetable')} style={{ ...styles.logoutBtn, color: '#2563eb', borderColor: '#2563eb' }} className="hover-scale">
                        Timetable
                    </button>
                    <button onClick={logout} style={styles.logoutBtn} className="hover-scale">
                        Logout
                    </button>
                </div>
            </nav>

            <main style={{ ...styles.main, position: "relative", zIndex: 1 }} className="px-4 py-10 sm:py-[60px] sm:px-[5%]">
                <header style={styles.header} className="animate-slide-up">
                    <h1 style={styles.title} className="text-3xl sm:text-[42px]">Available Courses</h1>
                    <p style={styles.subtitle}>
                        Select your specialization.
                        { (!!enrolledCourseId && enrolledCourseId !== "null" && enrolledCourseId !== "undefined") ? (
                            <span style={{ display: "block", marginTop: 10, color: "#10b981", fontWeight: 600 }}>
                                You are currently enrolled.
                            </span>
                        ) : (
                            <span style={{ display: "block", marginTop: 10, color: "#ef4444", fontWeight: 600 }}>
                                You are not enrolled in any course.
                            </span>
                        )}
                        {statusMessage && (
                            <span style={{
                                display: "block",
                                marginTop: 15,
                                color: statusMessage.type === 'error' ? '#ef4444' : '#2563eb',
                                fontWeight: 600,
                                padding: "10px",
                                background: statusMessage.type === 'error' ? '#fee2e2' : '#eff6ff',
                                borderRadius: "8px",
                                maxWidth: "fit-content",
                                margin: "15px auto"
                            }} className="animate-fade-in">
                                {statusMessage.text}
                            </span>
                        )}
                    </p>
                </header>

                {warningMessage && (
                  <div style={{
                    background: "#ffecec",
                    color: "#d8000c",
                    padding: "10px",
                    borderRadius: "6px",
                    marginBottom: "20px",
                    textAlign: "center",
                    fontWeight: 600
                  }}>
                    {warningMessage}
                  </div>
                )}

                <div style={styles.grid} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
                    {courses.map((course, index) => {
                        const hasEnrollment = !!enrolledCourseId && enrolledCourseId !== "null" && enrolledCourseId !== "undefined";
                        const isEnrolled = hasEnrollment && String(enrolledCourseId) === String(course.id);
                        const isSwitchingAllowed = hasEnrollment && !isEnrolled;

                        return (
                            <div
                                key={course.id}
                                style={{
                                    ...styles.card,
                                    border: isEnrolled ? "2px solid #2563eb" : "1px solid white",
                                    boxShadow: isEnrolled ? "0 10px 30px rgba(37, 99, 235, 0.15)" : "0 4px 6px -1px rgba(0,0,0,0.05)",
                                    animationDelay: `${index * 0.1}s` // Staggered animation
                                }}
                                className={`animate-slide-up hover-3d`}
                            >
                                <div style={styles.cardHeader}>
                                    <div>
                                        <h2 style={{ ...styles.courseName, color: isEnrolled ? "#2563eb" : "#1f2937" }}>
                                            {course.name}
                                        </h2>
                                        <div style={styles.tags}>
                                            <span style={styles.badge}>{course.credits} Credits</span>
                                            {isEnrolled && <span style={{ ...styles.badge, background: "#dcfce7", color: "#166534" }}>Enrolled</span>}
                                        </div>
                                    </div>
                                </div>

                                <p style={styles.description}>{course.description}</p>

                                <div style={styles.metaInfo}>
                                    <div style={styles.metaItem}>
                                        <span style={styles.icon}>👨‍🏫</span>
                                        <span>{course.faculty}</span>
                                    </div>
                                    <div style={styles.metaItem}>
                                        <span style={styles.icon}>🪑</span>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span>{course.filledSeats || 0} / {course.totalSeats || 0} Taken</span>
                                            <span style={{ color: (course.totalSeats || 0) - (course.filledSeats || 0) > 0 ? '#10b981' : '#ef4444', fontSize: '0.85em', fontWeight: 600 }}>
                                                {(course.totalSeats || 0) - (course.filledSeats || 0)} Available
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div style={styles.actionArea}>
                                    {isEnrolled ? (
                                        <button
                                            disabled={true}
                                            style={{
                                                ...styles.enrollBtn,
                                                background: "#dcfce7",
                                                color: "#166534",
                                                cursor: "not-allowed",
                                                boxShadow: "none"
                                            }}
                                        >
                                            Enrolled
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => enroll(course)}
                                            style={{
                                                ...styles.enrollBtn,
                                                background: "#2563eb",
                                                cursor: "pointer",
                                            }}
                                            className="hover-scale"
                                        >
                                            {isSwitchingAllowed ? "Select to Switch" : "Enroll Now"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        background: "#f8fafc", // A slightly cooler grey
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
    logoutBtn: {
        padding: "8px 20px",
        background: "transparent",
        color: "#ef4444",
        border: "1px solid #ef4444",
        borderRadius: 50,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s",
    },
    main: {
        // Tailwind handles padding
        maxWidth: 1400,
        margin: "0 auto",
    },
    header: {
        textAlign: "center" as const,
        marginBottom: 60,
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
    grid: {
        // Tailwind handles grid
    },
    card: {
        background: "white",
        borderRadius: 24,
        padding: 30,
        display: "flex",
        flexDirection: "column" as const,
        justifyContent: "space-between",
        transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)", // Bouncy effect
        height: "100%",
        position: "relative" as const,
        overflow: "hidden" as const,
    },
    cardHeader: {
        marginBottom: 20,
    },
    courseName: {
        fontSize: 22,
        fontWeight: 700,
        margin: "0 0 10px 0",
        lineHeight: 1.3,
    },
    tags: {
        display: "flex",
        gap: 10,
        flexWrap: "wrap" as const,
    },
    badge: {
        background: "#f1f5f9",
        color: "#475569",
        padding: "6px 14px",
        borderRadius: 50,
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.5px",
    },
    description: {
        fontSize: 15,
        color: "#64748b",
        lineHeight: 1.7,
        marginBottom: 30,
        flexGrow: 1,
    },
    metaInfo: {
        display: "flex",
        gap: 25,
        marginBottom: 30,
        paddingTop: 20,
        borderTop: "1px dashed #e2e8f0",
    },
    metaItem: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontSize: 14,
        color: "#475569",
        fontWeight: 500,
    },
    icon: {
        fontSize: 18,
    },
    actionArea: {
        marginTop: "auto",
    },
    enrollBtn: {
        width: "100%",
        padding: "16px",
        border: "none",
        borderRadius: 12,
        color: "white",
        fontWeight: 600,
        fontSize: 16,
        transition: "all 0.2s",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)",
    },
    dropBtn: {
        width: "100%",
        padding: "16px",
        border: "1px solid #fee2e2",
        background: "#fef2f2",
        borderRadius: 12,
        color: "#dc2626",
        fontWeight: 600,
        fontSize: 16,
        transition: "all 0.2s",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
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