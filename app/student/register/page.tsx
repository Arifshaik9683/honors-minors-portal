"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";



export default function Register() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        rollNumber: "",
        year: "",
        section: "",
    });

    const [error, setError] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: any) => {
        setError(""); // Clear error on typing
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!form.email || !form.password || !form.name || !form.rollNumber || !form.year || !form.section) {
            setError("Please fill in all details!");
            return;
        }

        if (!form.email.endsWith("@vishnu.edu.in")) {
            setError("Only Vishnu Institute students can register ❌");
            return;
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    phoneNumber: form.rollNumber, // Mapping rollNumber to phoneNumber in DB per previous schema expectation
                    rollNumber: form.rollNumber,
                    year: form.year,
                    section: form.section,
                    collegeName: "Vishnu Institute", // Hardcoded per requirement logic

                })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Registration failed");
                return;
            }

            // Redirect students to login page after successful registration
            router.push("/student");
        } catch (err) {
            console.error(err);
            setError("Network error occurred");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card} className="glass-panel hover-lift reveal-stagger delay-100">
                {/* ... existing header ... */}
                <div style={styles.header}>
                    <img src="/logo.jpeg" alt="Logo" style={styles.logo} className="animate-bounce-slow hover-lift" />
                    <h2 style={styles.title}>Create Account</h2>
                    <p style={styles.subtitle}>Join the Honors & Minors Portal</p>
                </div>

                <div style={styles.formGrid}>
                    {/* ... other inputs ... */}
                    {/* ... other inputs ... */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Full Name</label>
                        <input
                            name="name"
                            placeholder="John Doe"
                            style={styles.input}
                            className="input-premium"
                            onChange={handleChange}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Roll Number</label>
                        <input
                            name="rollNumber"
                            placeholder="e.g. 21PA1A0000"
                            style={styles.input}
                            className="input-premium"
                            onChange={handleChange}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Year</label>
                        <select name="year" style={styles.input} className="input-premium" onChange={handleChange} defaultValue="">
                            <option value="" disabled>Select Year</option>
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                        </select>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Section</label>
                        <select name="section" style={styles.input} className="input-premium" onChange={handleChange} defaultValue="">
                            <option value="" disabled>Select Section</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                        </select>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input
                            name="email"
                            placeholder="student@vishnu.edu.in"
                            style={styles.input}
                            className="input-premium"
                            onChange={handleChange}
                        />
                    </div>

                    <div style={{ ...styles.inputGroup, position: "relative" }}>
                        <label style={styles.label}>Password</label>
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            style={{ ...styles.input, paddingRight: 40 }}
                            className="input-premium"
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={styles.eyeIcon}
                            className="hover-lift"
                        >
                            {showPassword ? "👁️" : "🔒"}
                        </button>
                    </div>
                </div>

                {error && <div style={styles.error} className="animate-shake">{error}</div>}

                <button style={styles.button} onClick={handleSubmit} className="hover-lift animate-pulse-glow">
                    Register Now
                </button>

                <p style={styles.loginLink} onClick={() => router.push("/student")}>
                    Already have an account? <span style={styles.link}>Login</span>
                </p>
            </div>

            {/* Background Decorations */}
            <div className="animate-blob" style={{ ...styles.blob, top: "5%", left: "5%", background: "rgba(139, 92, 246, 0.3)" }}></div>
            <div className="animate-blob animation-delay-2000" style={{ ...styles.blob, bottom: "5%", right: "5%", background: "rgba(236, 72, 153, 0.3)" }}></div>
        </div>
    );
}

const styles = {
    // ... existing styles ...
    container: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
        fontFamily: "'Inter', sans-serif",
        padding: "40px 20px",
        position: "relative" as const,
        overflow: "hidden" as const,
    },
    card: {
        width: "100%",
        maxWidth: 550,
        padding: "40px",
        borderRadius: 24,
        position: "relative" as const,
        zIndex: 10,
    },
    header: {
        textAlign: "center" as const,
        marginBottom: 30,
    },
    logo: {
        height: 50,
        marginBottom: 15,
    },
    title: {
        fontSize: 28,
        fontWeight: 800,
        color: "#1e293b",
        marginBottom: 8,
        letterSpacing: "-0.5px",
    },
    subtitle: {
        fontSize: 15,
        color: "#64748b",
    },
    formGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px",
        marginBottom: 25,
    },
    inputGroup: {
        textAlign: "left" as const,
    },
    label: {
        display: "block",
        fontSize: 13,
        fontWeight: 600,
        color: "#475569",
        marginBottom: 8,
    },
    input: {
        width: "100%",
        padding: "12px 16px",
        borderRadius: 12,
        border: "1px solid #e2e8f0",
        fontSize: 14,
        outline: "none",
        transition: "all 0.2s",
        background: "#f8fafc",
    },
    eyeIcon: {
        position: "absolute" as const,
        right: 15,
        top: 38, // Adjusted for label height + padding
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: 18,
        color: "#64748b",
    },
    divider: {
        gridColumn: "1 / -1",
        borderBottom: "1px solid #f1f5f9",
        margin: "10px 0 20px",
        position: "relative" as const,
        textAlign: "center" as const,
    },
    dividerText: {
        position: "absolute" as const,
        top: -10,
        left: "50%",
        transform: "translateX(-50%)",
        background: "white",
        padding: "0 10px",
        color: "#94a3b8",
        fontSize: 12,
        fontWeight: 600,
        textTransform: "uppercase" as const,
        letterSpacing: "1px",
    },
    error: {
        background: "#fef2f2",
        color: "#ef4444",
        padding: "10px",
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 500,
        marginBottom: 20,
        textAlign: "center" as const,
        border: "1px solid #fee2e2",
    },
    button: {
        width: "100%",
        padding: "14px",
        background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
        color: "white",
        border: "none",
        borderRadius: 12,
        cursor: "pointer",
        fontSize: 16,
        fontWeight: 600,
        boxShadow: "0 4px 15px rgba(236, 72, 153, 0.3)",
        transition: "transform 0.2s, box-shadow 0.2s",
    },
    loginLink: {
        marginTop: 25,
        fontSize: 14,
        color: "#64748b",
        textAlign: "center" as const,
        cursor: "pointer",
    },
    link: {
        color: "#8b5cf6",
        fontWeight: 700,
        textDecoration: "underline",
    },
    blob: {
        position: "absolute" as const,
        width: 300,
        height: 300,
        borderRadius: "50%",
        filter: "blur(60px)",
        zIndex: 0,
    },
};