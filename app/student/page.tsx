"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";



function StudentLoginContent() {
    const router = useRouter();

    const [view, setView] = useState("login"); // "login", "forgot"
    const [loginData, setLoginData] = useState({ email: "", password: "" });

    // Forgot Password State
    const [forgotData, setForgotData] = useState({
        email: "",
        answer1: "",
        answer2: "",
        newPassword: "",
    });
    const [step, setStep] = useState(1); // 1: Email, 2: Questions, 3: New Password

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    // Google Login Hook
    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const userInfo = await axios.get(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
                );

                const { email, name } = userInfo.data;

                // Domain Validation for Google Login
                if (!email.endsWith("@vishnu.edu.in")) {
                    setError("Only Vishnu Institute students can login ❌");
                    return;
                }

                // For Google Login, we directly set userRole and userEmail and redirect.
                // The actual student creation/lookup should happen on the backend.
                localStorage.setItem("userRole", "student");
                localStorage.setItem("userEmail", email);
                localStorage.setItem("student", JSON.stringify({ email, name })); // Added
                router.push("/student/dashboard"); // Updated to point to /student/dashboard

            } catch (err) {
                console.error("Google Login Error:", err);
                setError("Google Sign-In Failed!");
            }
        },
        onError: () => setError("Google Sign-In Failed!"),
    });

    const handleLoginChange = (e: any) => {
        setError("");
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleForgotChange = (e: any) => {
        setError("");
        setForgotData({ ...forgotData, [e.target.name]: e.target.value });
    };

    const handleLogin = async () => {
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: loginData.email,
                    password: loginData.password,
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Invalid Credentials ❌");
                return;
            }

            // Setting standard role markers if the rest of the frontend relies on it
            localStorage.setItem("userRole", "student");
            localStorage.setItem("userEmail", loginData.email);
            localStorage.setItem("token", data.token); // Store JWT securely
            localStorage.setItem("student", JSON.stringify(data.student)); // Store student to pass auth guards

            router.push("/student/dashboard");
        } catch (err) {
            console.error(err);
            setError("Network Error ❌");
        }
    };

    const handleForgotStep1 = async () => {
        // TODO: Call an API to verify if the email exists to proceed
        setError("Forgot password API not yet migrated to MongoDB.");
        /*
        const students = Storage.getStudents();
        const student = students.find((s: any) => s.email === forgotData.email);

        if (!student) {
            setError("Email not found!");
            return;
        }
        setStep(2);
        */
    };

    const handleForgotStep2 = async () => {
        setError("Forgot password API not yet migrated to MongoDB.");
        /*
        const students = Storage.getStudents();
        const student = students.find((s: any) => s.email === forgotData.email);

        if (student) {
            const storedAnswer1 = (student.answer1 || "").trim().toLowerCase();
            const storedAnswer2 = (student.answer2 || "").trim().toLowerCase();
            const inputAnswer1 = (forgotData.answer1 || "").trim().toLowerCase();
            const inputAnswer2 = (forgotData.answer2 || "").trim().toLowerCase();

            if (storedAnswer1 && storedAnswer2 && storedAnswer1 === inputAnswer1 && storedAnswer2 === inputAnswer2) {
                setStep(3);
                return;
            }
        }

        setError("Incorrect answers to security questions!");
        */
    };

    const handleForgotStep3 = async () => {
        if (!forgotData.newPassword) {
            setError("Please enter a new password!");
            return;
        }

        setError("Forgot password API not yet migrated to MongoDB.");
        /*
        const students = Storage.getStudents();
        const studentIndex = students.findIndex((s: any) => s.email === forgotData.email);

        if (studentIndex !== -1) {
            students[studentIndex].password = forgotData.newPassword;
            Storage.saveStudentsList(students);

            // Update session if it matches
            const sessionStudent = JSON.parse(localStorage.getItem("student") || "{}");
            if (sessionStudent.email === forgotData.email) {
                sessionStudent.password = forgotData.newPassword;
                localStorage.setItem("student", JSON.stringify(sessionStudent));
            }
        }

        setView("login");
        setSuccess("Password Reset Successful! Please Login.");
        setForgotData({ email: "", answer1: "", answer2: "", newPassword: "" });
        setStep(1);
        */
    };

    return (
        <div style={styles.container} className="py-10 px-4">
            <div style={styles.card} className="w-full max-w-[450px] p-6 sm:px-[30px] sm:py-[40px] glass-panel hover-lift reveal-stagger delay-100">
                <div style={styles.logoContainer}>
                    <img src="/logo.jpeg" alt="Portal Logo" style={styles.logo} className="hover-lift" />
                </div>

                <h2 style={styles.title}>
                    {view === "login" ? "Student Portal Login" : "Reset Password"}
                </h2>

                <p style={styles.subtitle}>
                    {view === "login"
                        ? "Login to access Honors & Minors Portal"
                        : "Recover your account credentials"}
                </p>

                {view === "login" && (
                    <>
                        {success && <p style={{ color: "green", fontSize: 13, marginBottom: 10 }}>{success}</p>}
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Email Address</label>
                            <input
                                name="email"
                                type="text"
                                placeholder="Enter your email"
                                style={styles.input}
                                className="input-premium"
                                onChange={handleLoginChange}
                            />
                        </div>

                        <div style={{ ...styles.inputGroup, position: "relative" }}>
                            <label style={styles.label}>Password</label>
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                style={{ ...styles.input, paddingRight: 40 }}
                                className="input-premium"
                                onChange={handleLoginChange}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={styles.eyeIcon}
                            >
                                {showPassword ? "👁️" : "🔒"}
                            </button>
                        </div>

                        {error && <p style={{ color: "red", fontSize: 13, marginBottom: 10 }}>{error}</p>}

                        <button style={styles.button} className="hover-lift animate-pulse-glow" onClick={handleLogin}>
                            Login
                        </button>

                        <div style={styles.footerLinks}>
                            <p style={styles.register} onClick={() => router.push("/student/register")}>
                                New User? <span style={styles.link}>Register Here</span>
                            </p>
                        </div>
                    </>
                )}

                {view === "forgot" && (
                    <>
                        {step === 1 && (
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Enter your Email</label>
                                <input name="email" placeholder="Email Address" style={styles.input} className="input-premium" onChange={handleForgotChange} />
                                {error && <p style={{ color: "red", fontSize: 13, marginTop: 10 }}>{error}</p>}
                                <button style={styles.button} className="hover-lift animate-pulse-glow" onClick={handleForgotStep1}>Next</button>
                            </div>
                        )}

                        {step === 2 && (
                            <>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>What is your favorite sport?</label>
                                    <input name="answer1" placeholder="Answer" style={styles.input} className="input-premium" onChange={handleForgotChange} value={forgotData.answer1} />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>What is your favorite pet?</label>
                                    <input name="answer2" placeholder="Answer" style={styles.input} className="input-premium" onChange={handleForgotChange} value={forgotData.answer2} />
                                </div>
                                {error && <p style={{ color: "red", fontSize: 13, marginTop: 10 }}>{error}</p>}
                                <button style={styles.button} className="hover-lift animate-pulse-glow" onClick={handleForgotStep2}>Verify Answers</button>
                            </>
                        )}

                        {step === 3 && (
                            <>
                                <div style={{ ...styles.inputGroup, position: "relative" }}>
                                    <label style={styles.label}>Enter New Password</label>
                                    <input
                                        name="newPassword"
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="New Password"
                                        style={{ ...styles.input, paddingRight: 40 }}
                                        className="input-premium"
                                        onChange={handleForgotChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        style={styles.eyeIcon}
                                        className="hover-lift"
                                    >
                                        {showNewPassword ? "👁️" : "🔒"}
                                    </button>
                                </div>
                                {error && <p style={{ color: "red", fontSize: 13, marginTop: 10 }}>{error}</p>}
                                <button style={styles.button} className="hover-lift animate-pulse-glow" onClick={handleForgotStep3}>Reset Password</button>
                            </>
                        )}

                        <p style={{ ...styles.register, marginTop: 20 }} onClick={() => { setView("login"); setError(""); setSuccess(""); setStep(1); }}>
                            Back to Login
                        </p>
                    </>
                )}

                {(view === "login" || view === "register") && (
                    <>
                        <div style={styles.divider}>
                            <span style={styles.dividerText}>OR</span>
                        </div>
                        <button style={styles.googleButton} className="hover-lift" onClick={() => googleLogin()}>
                            <img
                                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                alt="Google Logo"
                                style={{ width: 20, height: 20, marginRight: 10 }}
                            />
                            Sign in with Google
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default function StudentLogin() {
    return (
        <GoogleOAuthProvider clientId="YOUR_CLIENT_ID_HERE">
            <StudentLoginContent />
        </GoogleOAuthProvider>
    );
}

// ... styles remain the same
const styles = {
    container: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
        fontFamily: "'Inter', sans-serif",
    },
    card: {
        borderRadius: 20,
        textAlign: "center" as const,
    },
    logoContainer: {
        display: "flex",
        justifyContent: "center",
        marginBottom: 20,
    },
    logo: {
        height: 60,
        width: "auto",
        objectFit: "contain" as const,
    },
    title: {
        fontSize: 24,
        fontWeight: 700,
        marginBottom: 10,
        color: "#1f2937",
    },
    subtitle: {
        fontSize: 14,
        color: "#6b7280",
        marginBottom: 30,
    },
    inputGroup: {
        marginBottom: 15,
        textAlign: "left" as const,
    },
    label: {
        display: "block",
        fontSize: 13,
        fontWeight: 600,
        marginBottom: 6,
        color: "#374151",
    },
    input: {
        width: "100%",
        padding: "10px 14px",
        borderRadius: 8,
        border: "1px solid #d1d5db",
        fontSize: 14,
        outline: "none",
        transition: "border-color 0.2s",
    },
    eyeIcon: {
        position: "absolute" as const,
        right: 15,
        top: 35, // Adjusted for label height + padding
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: 16,
        color: "#6b7280",
    },
    button: {
        width: "100%",
        padding: "12px",
        background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
        color: "white",
        border: "none",
        borderRadius: 8,
        cursor: "pointer",
        fontSize: 16,
        fontWeight: 600,
        marginTop: 10,
        transition: "background 0.2s",
        boxShadow: "0 4px 15px rgba(236, 72, 153, 0.2)",
    },
    footerLinks: {
        marginTop: 20,
        display: "flex",
        flexDirection: "column" as const,
        gap: 5,
        fontSize: 14,
    },
    forgot: {
        color: "#6b7280",
        cursor: "pointer",
        margin: 0,
    },
    register: {
        color: "#6b7280",
        cursor: "pointer",
        margin: 0,
    },
    link: {
        color: "#8b5cf6",
        fontWeight: "bold",
    },
    divider: {
        margin: "25px 0",
        position: "relative" as const,
        borderBottom: "1px solid #e5e7eb",
    },
    dividerText: {
        position: "absolute" as const,
        top: -10,
        left: "50%",
        transform: "translateX(-50%)",
        background: "white",
        padding: "0 10px",
        color: "#9ca3af",
        fontSize: 12,
        fontWeight: 600,
    },
    googleButton: {
        width: "100%",
        padding: "12px",
        background: "white",
        color: "#374151",
        border: "1px solid #d1d5db",
        borderRadius: 8,
        cursor: "pointer",
        fontSize: 14,
        fontWeight: 600,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transition: "background 0.2s",
    },
};