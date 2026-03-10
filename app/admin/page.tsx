"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { authorizedAdmins } from "../data/admins";

export default function AdminLogin() {
    const router = useRouter();

    const [view, setView] = useState("login"); // "login" | "register"
    const [registerData, setRegisterData] = useState({ email: "", password: "", confirmPassword: "" });
    const [success, setSuccess] = useState("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleLogin = async () => {
        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    password,
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Invalid Credentials or Unauthorized ❌");
                return;
            }

            localStorage.setItem("userRole", "admin");
            localStorage.setItem("userEmail", email);
            localStorage.setItem("token", data.token);

            router.push("/admin/dashboard");
        } catch (err) {
            console.error(err);
            setError("Network Error ❌");
        }
    };

    const handleRegister = () => {
        if (!registerData.email || !registerData.password || !registerData.confirmPassword) {
            setError("All fields are required!");
            return;
        }

        // Domain Validation
        if (!registerData.email.endsWith("@vishnu.edu.in")) {
            setError("Only Vishnu Institute emails allowed ❌");
            return;
        }

        if (registerData.password !== registerData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        const localAdmins = JSON.parse(localStorage.getItem("local_admins") || "{}");

        if (registerData.email in localAdmins || registerData.email in authorizedAdmins) {
            setError("Admin already exists!");
            return;
        }

        localAdmins[registerData.email] = registerData.password;
        localStorage.setItem("local_admins", JSON.stringify(localAdmins));

        setSuccess("Registration Successful! Please Login.");
        setView("login");
        setRegisterData({ email: "", password: "", confirmPassword: "" });
        setError("");
    };

    return (
        <div style={styles.container} className="animate-bg-pan">
            {/* Background Blobs for depth */}
            <div className="animate-blob" style={{ position: "absolute", top: "20%", left: "20%", width: "300px", height: "300px", background: "rgba(236, 72, 153, 0.3)", borderRadius: "50%", filter: "blur(60px)", zIndex: 0 }}></div>
            <div className="animate-blob animation-delay-2000" style={{ position: "absolute", bottom: "20%", right: "20%", width: "250px", height: "250px", background: "rgba(139, 92, 246, 0.3)", borderRadius: "50%", filter: "blur(60px)", zIndex: 0 }}></div>

            <div style={styles.card} className="glass-panel hover-lift reveal-stagger delay-100">
                <div style={styles.logoContainer}>
                    <img src="/logo.jpeg" alt="Portal Logo" style={styles.logo} className="logo-animate hover-lift" />
                </div>
                <h2 style={styles.title}>{view === "login" ? "Admin Portal" : "New Admin"}</h2>
                <p style={styles.subtitle}>
                    {view === "login" ? "Secure login for authorized personnel" : "Sign In for admin access"}
                </p>

                {success && <p style={{ color: "green", fontSize: 13, marginBottom: 15 }}>{success}</p>}

                {view === "login" ? (
                    <>
                        {/* Email */}
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Email Address</label>
                            <input
                                type="text"
                                placeholder="admin@college.edu"
                                style={styles.input}
                                className="input-premium"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                            />
                        </div>

                        {/* Password */}
                        <div style={{ ...styles.inputGroup, position: "relative" }}>
                            <label style={styles.label}>Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                style={{ ...styles.input, padding: "14px 40px 14px 18px" }}
                                className="input-premium"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={styles.eyeIcon}
                                className="hover-scale"
                            >
                                {showPassword ? "👁️" : "🔒"}
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Register Email */}
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Email Address</label>
                            <input
                                type="text"
                                placeholder="new.admin@vishnu.edu.in"
                                style={styles.input}
                                className="input-premium"
                                value={registerData.email}
                                onChange={(e) => { setRegisterData({ ...registerData, email: e.target.value }); setError(""); }}
                            />
                        </div>

                        {/* Register Password */}
                        <div style={{ ...styles.inputGroup, position: "relative" }}>
                            <label style={styles.label}>Password</label>
                            <input
                                type={showRegisterPassword ? "text" : "password"}
                                placeholder="Create Password"
                                style={{ ...styles.input, padding: "14px 40px 14px 18px" }}
                                className="input-premium"
                                value={registerData.password}
                                onChange={(e) => { setRegisterData({ ...registerData, password: e.target.value }); setError(""); }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                                style={styles.eyeIcon}
                                className="hover-scale"
                            >
                                {showRegisterPassword ? "👁️" : "🔒"}
                            </button>
                        </div>

                        {/* Confirm Password */}
                        <div style={{ ...styles.inputGroup, position: "relative" }}>
                            <label style={styles.label}>Confirm Password</label>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm Password"
                                style={{ ...styles.input, padding: "14px 40px 14px 18px" }}
                                className="input-premium"
                                value={registerData.confirmPassword}
                                onChange={(e) => { setRegisterData({ ...registerData, confirmPassword: e.target.value }); setError(""); }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={styles.eyeIcon}
                                className="hover-scale"
                            >
                                {showConfirmPassword ? "👁️" : "🔒"}
                            </button>
                        </div>
                    </>
                )}

                {error && (
                    <div className="animate-shake" style={{ marginBottom: 15 }}>
                        <p style={{ color: "#ef4444", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                            <span>⚠️</span> {error}
                        </p>
                    </div>
                )}

                {/* Action Button */}
                <button
                    style={styles.button}
                    onClick={view === "login" ? handleLogin : handleRegister}
                    className="hover-lift animate-pulse-glow"
                >
                    {view === "login" ? "Access Dashboard" : "Sign In"}
                </button>

                <div style={styles.footerLinks}>
                    <a href="/" style={{ ...styles.forgot, marginTop: 10, color: "#8b5cf6" }} className="link-hover">Back to Home</a>
                </div>
            </div>
        </div>
    );
}

/* ---------- Styles ---------- */

const styles = {
    container: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(-45deg, #1e1b4b, #312e81, #4c1d95, #701a75)",
        backgroundSize: "400% 400%",
        fontFamily: "'Inter', sans-serif",
        position: "relative" as const,
        overflow: "hidden" as const,
    },

    card: {
        width: 420,
        padding: "50px 40px",
        borderRadius: 24,
        textAlign: "center" as const,
        zIndex: 1,
        position: "relative" as const,
    },

    logoContainer: {
        display: "flex",
        justifyContent: "center",
        marginBottom: 25,
    },

    logo: {
        height: 70,
        width: "auto",
        objectFit: "contain" as const,
        filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))",
    },

    title: {
        fontSize: 28,
        fontWeight: 800,
        marginBottom: 10,
        color: "#111827",
        letterSpacing: "-0.5px",
    },

    subtitle: {
        fontSize: 15,
        color: "#6b7280",
        marginBottom: 35,
        lineHeight: 1.5,
    },

    inputGroup: {
        marginBottom: 25,
        textAlign: "left" as const,
    },

    label: {
        display: "block",
        fontSize: 14,
        fontWeight: 600,
        marginBottom: 8,
        color: "#374151",
        marginLeft: 4,
    },

    input: {
        width: "100%",
        padding: "14px 18px",
        borderRadius: 12,
        border: "2px solid #e5e7eb",
        fontSize: 15,
        outline: "none",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        background: "#f9fafb",
        color: "#1f2937",
    },

    eyeIcon: {
        position: "absolute" as const,
        right: 18,
        top: 42,
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: 18,
        color: "#9ca3af",
        padding: 0,
    },

    button: {
        width: "100%",
        padding: "14px",
        background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
        color: "white",
        border: "none",
        borderRadius: 12,
        cursor: "pointer",
        fontSize: 16,
        fontWeight: 600,
        marginTop: 15,
        transition: "all 0.3s ease",
        boxShadow: "0 4px 12px rgba(236, 72, 153, 0.3)",
        letterSpacing: "0.5px",
    },

    footerLinks: {
        marginTop: 30,
        display: "flex",
        flexDirection: "column" as const,
        gap: 8,
        fontSize: 14,
    },

    forgot: {
        color: "#6b7280",
        cursor: "pointer",
        textDecoration: "none",
        transition: "color 0.2s",
        fontWeight: 500,
    },
};