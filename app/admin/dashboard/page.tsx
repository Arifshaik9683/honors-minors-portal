"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Storage } from "../../utils/storage";
import { Student, Subject } from "../../types";

export default function AdminDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    // Data State
    const [students, setStudents] = useState<Student[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [activeTab, setActiveTab] = useState<"enrollments" | "subjects">("enrollments");

    // Filter/Search State
    const [searchTerm, setSearchTerm] = useState("");
    const [filterSection, setFilterSection] = useState("");
    const [filterSubject, setFilterSubject] = useState("");

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState<Partial<Subject> | null>(null);

    useEffect(() => {
        // Route protection
        const role = localStorage.getItem("userRole");
        if (role !== "admin") {
            router.push("/admin");
        } else {
            refreshData();
            setLoading(false);
        }
    }, [router]);

    const refreshData = async () => {
        try {
            const res = await fetch('/api/admin/students');
            if (res.ok) {
                const data = await res.json();
                setStudents(data);
            }
        } catch (err) {
            console.error("Failed to fetch students", err);
        }

        try {
            const res = await fetch('/api/admin/courses');
            if (res.ok) {
                const data = await res.json();
                setSubjects(data);
            }
        } catch (err) {
            console.error("Failed to fetch courses", err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("userRole");
        localStorage.removeItem("userEmail");
        router.push("/");
    };

    // --- Statistics ---
    const enrolled2ndYears = students.filter(s => s.year === "2" && s.enrolledSubjectId).length;
    const totalSeats = subjects.reduce((sum, s) => sum + s.totalSeats, 0);
    const totalFilled = subjects.reduce((sum, s) => sum + s.filledSeats, 0);
    const totalRemaining = totalSeats - totalFilled;

    // --- Enrollment Table Logic ---
    const filteredStudents = students.filter(student => {
        // Search
        const matchesSearch =
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());

        // Filter Section
        const matchesSection = filterSection ? student.section === filterSection : true;

        // Filter Subject
        const matchesSubject = filterSubject ? String(student.enrolledSubjectId) === String(filterSubject) : true;

        // Only show if they have enrollment data (implied by "Enrollment Table", but sticking to showing all allowed or just enrolled?)
        // The prompt says "Student Enrollment Table", usually implies list of enrolled students.
        // But handy to see everyone. Let's show everyone who has proper data (Year 2 primarily?)
        // Requirement 1 says "Only 2nd Year allowed". Let's show all students but highlight enrollment.
        return matchesSearch && matchesSection && matchesSubject;
    });

    const getSubjectName = (id?: string | number | null) => {
        if (!id) return "-";
        return subjects.find(s => String(s.id) === String(id))?.name || "Unknown";
    };

    // --- Subject Management Logic ---
    const handleSaveSubject = async () => {
        if (!editingSubject?.name || !editingSubject.faculty || !editingSubject.totalSeats) {
            alert("Please fill required fields (Name, Faculty, Seats)");
            return;
        }

        try {
            // Note: Edit and Add both mapped to POST for now per requirements to store in MongoDB
            const res = await fetch("/api/admin/courses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    subjectName: editingSubject.name,
                    assignedFaculty: editingSubject.faculty,
                    credits: editingSubject.credits,
                    totalSeats: editingSubject.totalSeats,
                    description: editingSubject.description,
                    timetable: editingSubject.timetable
                })
            });

            if (res.ok) {
                setIsModalOpen(false);
                setEditingSubject(null);
                refreshData();
            } else {
                alert("Failed to save subject. Please try again.");
            }
        } catch (e) {
            console.error(e);
            alert("Network error while saving subject.");
        }
    };

    const handleDeleteSubject = async (id: number | string) => {
        if (confirm("Are you sure? This will remove the subject.")) {
            try {
                // To be fully functional, we can add a DELETE method to the API, but for now we focus on POST/GET as requested.
                alert("Delete functionally requires a new API endpoint. Please define DELETE behavior first.");
                // Storage.deleteSubject(id as number);
                // refreshData();
            } catch (e) { }
        }
    };

    if (loading) {
        return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>Checking Access...</div>;
    }

    return (
        <div style={styles.container}>
            {/* Header */}
            <header style={styles.header}>
                <div style={styles.logoContainer}>
                    <img src="/logo.jpeg" alt="Logo" style={styles.logo} />
                    <h1 style={styles.title}>Admin Dashboard</h1>
                </div>
                <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </header>

            <main style={styles.main}>
                {/* Summary Cards */}
                <div style={styles.summaryGrid}>
                    <SummaryCard title="2nd Year Enrolled" value={enrolled2ndYears} icon="🎓" color="blue" />
                    <SummaryCard title="Total Subjects" value={subjects.length} icon="📚" color="purple" />
                    <SummaryCard title="Seats Filled" value={totalFilled} icon="✅" color="green" />
                    <SummaryCard title="Seats Remaining" value={totalRemaining} icon="⏳" color="orange" />
                </div>

                {/* Tabs */}
                <div style={styles.tabs}>
                    <button
                        style={activeTab === "enrollments" ? styles.activeTab : styles.tab}
                        onClick={() => setActiveTab("enrollments")}
                    >
                        📋 Student Enrollments
                    </button>
                    <button
                        style={activeTab === "subjects" ? styles.activeTab : styles.tab}
                        onClick={() => setActiveTab("subjects")}
                    >
                        ⚙️ Manage Subjects
                    </button>
                </div>

                {/* Content Area */}
                <div style={styles.contentArea}>

                    {activeTab === "enrollments" && (
                        <div className="animate-fade-in">
                            {/* Filters */}
                            <div style={styles.filterBar}>
                                <input
                                    style={styles.searchInput}
                                    placeholder="🔍 Search name or roll no..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <div style={styles.selectGroup}>
                                    <select style={styles.select} value={filterSection} onChange={(e) => setFilterSection(e.target.value)}>
                                        <option value="">All Sections</option>
                                        <option value="A">Section A</option>
                                        <option value="B">Section B</option>
                                        <option value="C">Section C</option>
                                    </select>
                                    <select style={styles.select} value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}>
                                        <option value="">All Subjects</option>
                                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Table */}
                            <div style={styles.tableContainer}>
                                <table style={styles.table}>
                                    <thead>
                                        <tr>
                                            <th style={styles.th}>Name</th>
                                            <th style={styles.th}>Roll Number</th>
                                            <th style={styles.th}>Year</th>
                                            <th style={styles.th}>Section</th>
                                            <th style={styles.th}>Enrolled Subject</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredStudents.length > 0 ? (
                                            filteredStudents.map((student, i) => (
                                                <tr key={i} style={styles.tr}>
                                                    <td style={styles.td}>{student.name}</td>
                                                    <td style={styles.td}>{student.rollNumber || "-"}</td>
                                                    <td style={styles.td}>{student.year ? `${student.year} Year` : "-"}</td>
                                                    <td style={styles.td}>{student.section ? `Sec ${student.section}` : "-"}</td>
                                                    <td style={styles.td}>
                                                        {student.enrolledSubjectId ? (
                                                            <span style={styles.enrolledBadge}>
                                                                {getSubjectName(student.enrolledSubjectId)}
                                                            </span>
                                                        ) : (
                                                            <span style={styles.notEnrolled}>Not Enrolled</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} style={{ padding: 20, textAlign: "center", color: "#888" }}>
                                                    No students found matching filters.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === "subjects" && (
                        <div className="animate-fade-in">
                            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
                                <button
                                    style={styles.actionBtn}
                                    onClick={() => { setEditingSubject({}); setIsModalOpen(true); }}
                                >
                                    + Add New Subject
                                </button>
                            </div>

                            <div style={styles.subjectGrid}>
                                {subjects.map(subject => (
                                    <div key={subject.id} style={styles.subjectCard}>
                                        <div style={styles.subjectHeader}>
                                            <h3 style={styles.subjectTitle}>{subject.name}</h3>
                                            <span style={styles.seatBadge}>{subject.filledSeats} / {subject.totalSeats} Filled</span>
                                        </div>
                                        <div style={styles.subjectBody}>
                                            <p><strong>Faculty:</strong> {subject.faculty}</p>
                                            <p><strong>Credits:</strong> {subject.credits || "-"}</p>
                                            <div style={styles.progressContainer}>
                                                <div
                                                    style={{
                                                        ...styles.progressBar,
                                                        width: `${(subject.filledSeats / subject.totalSeats) * 100}%`
                                                    }}
                                                />
                                            </div>
                                            <p style={{ fontSize: 12, marginTop: 5, color: "#666" }}>
                                                {subject.totalSeats - subject.filledSeats} seats remaining
                                            </p>
                                        </div>
                                        <div style={styles.subjectActions}>
                                            <button
                                                style={{ ...styles.iconBtn, color: "#2563eb" }}
                                                onClick={() => { setEditingSubject(subject); setIsModalOpen(true); }}
                                            >
                                                Edit / Assign
                                            </button>
                                            <button
                                                style={{ ...styles.iconBtn, color: "#ef4444" }}
                                                onClick={() => handleDeleteSubject(subject.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </main>

            {/* Modal */}
            {isModalOpen && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h2 style={{ marginBottom: 20 }}>{editingSubject?.id ? "Edit Subject" : "Add Subject"}</h2>
                        <div style={styles.formGroup}>
                            <label>Subject Name</label>
                            <input
                                style={styles.modalInput}
                                value={editingSubject?.name || ""}
                                onChange={(e) => setEditingSubject({ ...editingSubject, name: e.target.value })}
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label>Assigned Faculty</label>
                            <input
                                style={styles.modalInput}
                                value={editingSubject?.faculty || ""}
                                onChange={(e) => setEditingSubject({ ...editingSubject, faculty: e.target.value })}
                            />
                        </div>
                        <div style={{ display: "flex", gap: 10 }}>
                            <div style={styles.formGroup}>
                                <label>Credits</label>
                                <input
                                    type="number"
                                    style={styles.modalInput}
                                    value={editingSubject?.credits || ""}
                                    onChange={(e) => setEditingSubject({ ...editingSubject, credits: Number(e.target.value) })}
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label>Total Seats</label>
                                <input
                                    type="number"
                                    style={styles.modalInput}
                                    value={editingSubject?.totalSeats || ""}
                                    onChange={(e) => setEditingSubject({ ...editingSubject, totalSeats: Number(e.target.value) })}
                                />
                            </div>
                        </div>
                        <div style={styles.formGroup}>
                            <label>Description</label>
                            <textarea
                                style={{ ...styles.modalInput, height: 80 }}
                                value={editingSubject?.description || ""}
                                onChange={(e) => setEditingSubject({ ...editingSubject, description: e.target.value })}
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label>Timetable</label>
                            <textarea
                                style={{ ...styles.modalInput, height: 80, fontFamily: 'monospace' }}
                                placeholder="E.g.,&#10;Monday: 10:00 AM - 12:00 PM&#10;Wednesday: 02:00 PM - 04:00 PM"
                                value={editingSubject?.timetable || ""}
                                onChange={(e) => setEditingSubject({ ...editingSubject, timetable: e.target.value })}
                            />
                        </div>
                        <div style={styles.modalActions}>
                            <button style={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button style={styles.saveBtn} onClick={handleSaveSubject}>Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function SummaryCard({ title, value, icon, color }: any) {
    const bgColors: any = {
        blue: "#dbeafe",
        purple: "#f3e8ff",
        green: "#dcfce7",
        orange: "#ffedd5"
    };
    const textColors: any = {
        blue: "#1e40af",
        purple: "#6b21a8",
        green: "#166534",
        orange: "#9a3412"
    };

    return (
        <div style={{ ...styles.summaryCard, background: "white", borderLeft: `4px solid ${textColors[color]}` }}>
            <div>
                <p style={{ margin: 0, fontSize: 13, color: "#64748b", fontWeight: 600 }}>{title}</p>
                <h3 style={{ margin: "5px 0 0 0", fontSize: 24, fontWeight: 800, color: "#1e293b" }}>{value}</h3>
            </div>
            <div style={{ ...styles.cardIcon, background: bgColors[color], color: textColors[color] }}>
                {icon}
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        background: "#f1f5f9",
        fontFamily: "'Inter', sans-serif",
    },
    header: {
        background: "white",
        padding: "15px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    },
    logoContainer: {
        display: "flex",
        alignItems: "center",
        gap: 15,
    },
    logo: {
        height: 40,
    },
    title: {
        fontSize: 18,
        fontWeight: 700,
        margin: 0,
        color: "#1e293b",
    },
    logoutBtn: {
        background: "#fee2e2",
        color: "#ef4444",
        border: "none",
        padding: "8px 16px",
        borderRadius: 6,
        fontWeight: 600,
        cursor: "pointer",
    },
    main: {
        padding: "40px",
        maxWidth: 1400,
        margin: "0 auto",
    },
    summaryGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: 20,
        marginBottom: 40,
    },
    summaryCard: {
        padding: 20,
        borderRadius: 12,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
    },
    cardIcon: {
        width: 45,
        height: 45,
        borderRadius: 12,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 20,
    },
    tabs: {
        display: "flex",
        gap: 10,
        marginBottom: 20,
    },
    tab: {
        padding: "10px 20px",
        background: "transparent",
        border: "none",
        borderBottom: "2px solid transparent",
        color: "#64748b",
        fontWeight: 600,
        cursor: "pointer",
        fontSize: 15,
    },
    activeTab: {
        padding: "10px 20px",
        background: "transparent",
        border: "none",
        borderBottom: "2px solid #2563eb",
        color: "#2563eb",
        fontWeight: 600,
        cursor: "pointer",
        fontSize: 15,
    },
    contentArea: {
        background: "white",
        padding: 30,
        borderRadius: 16,
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
    },
    filterBar: {
        display: "flex",
        gap: 15,
        marginBottom: 25,
        flexWrap: "wrap",
    },
    searchInput: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        border: "1px solid #e2e8f0",
        minWidth: 200,
    },
    selectGroup: {
        display: "flex",
        gap: 15,
    },
    select: {
        padding: 10,
        borderRadius: 8,
        border: "1px solid #e2e8f0",
        background: "white",
    },
    tableContainer: {
        overflowX: "auto" as const,
    },
    table: {
        width: "100%",
        borderCollapse: "collapse" as const,
        fontSize: 14,
    },
    th: {
        textAlign: "left" as const,
        padding: "12px 15px",
        borderBottom: "2px solid #e2e8f0",
        color: "#64748b",
        fontWeight: 600,
    },
    tr: {
        borderBottom: "1px solid #f1f5f9",
    },
    td: {
        padding: "12px 15px",
        color: "#334155",
    },
    enrolledBadge: {
        background: "#dcfce7",
        color: "#166534",
        padding: "4px 10px",
        borderRadius: 50,
        fontSize: 12,
        fontWeight: 600,
    },
    notEnrolled: {
        color: "#94a3b8",
        fontStyle: "italic",
    },
    subjectGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: 20,
    },
    subjectCard: {
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        padding: 20,
        background: "#f8fafc",
    },
    subjectHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "start",
        marginBottom: 15,
    },
    subjectTitle: {
        margin: 0,
        fontSize: 16,
        fontWeight: 700,
        color: "#1e293b",
    },
    seatBadge: {
        background: "white",
        border: "1px solid #e2e8f0",
        padding: "4px 8px",
        borderRadius: 6,
        fontSize: 11,
        fontWeight: 600,
        color: "#475569",
    },
    subjectBody: {
        fontSize: 13,
        color: "#475569",
        marginBottom: 15,
    },
    progressContainer: {
        height: 6,
        background: "#e2e8f0",
        borderRadius: 10,
        marginTop: 10,
        overflow: "hidden",
    },
    progressBar: {
        height: "100%",
        background: "#2563eb",
        borderRadius: 10,
        transition: "width 0.3s",
    },
    subjectActions: {
        display: "flex",
        justifyContent: "space-between",
        borderTop: "1px solid #e2e8f0",
        paddingTop: 15,
    },
    iconBtn: {
        background: "none",
        border: "none",
        cursor: "pointer",
        fontWeight: 600,
        fontSize: 13,
        display: "flex",
        alignItems: "center",
        gap: 5,
    },
    actionBtn: {
        background: "#2563eb",
        color: "white",
        border: "none",
        padding: "10px 20px",
        borderRadius: 8,
        fontWeight: 600,
        cursor: "pointer",
    },
    modalOverlay: {
        position: "fixed" as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100,
    },
    modal: {
        background: "white",
        padding: 30,
        borderRadius: 16,
        width: 500,
        maxWidth: "90%",
    },
    formGroup: {
        marginBottom: 15,
        display: "flex",
        flexDirection: "column" as const,
        gap: 5,
        fontSize: 14,
        fontWeight: 500,
        color: "#475569",
    },
    modalInput: {
        padding: 10,
        borderRadius: 8,
        border: "1px solid #cbd5e1",
        fontSize: 14,
    },
    modalActions: {
        display: "flex",
        justifyContent: "flex-end",
        gap: 15,
        marginTop: 25,
    },
    cancelBtn: {
        background: "transparent",
        color: "#64748b",
        border: "none",
        fontWeight: 600,
        cursor: "pointer",
    },
    saveBtn: {
        background: "#2563eb",
        color: "white",
        border: "none",
        padding: "10px 20px",
        borderRadius: 8,
        fontWeight: 600,
        cursor: "pointer",
    },
} as const;
