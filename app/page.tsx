"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
    const router = useRouter();

    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div style={styles.container}>
            {/* Navbar */}
            <nav className="w-full sticky top-0 bg-white/80 backdrop-blur-md z-[100] shadow-[0_4px_30px_rgba(0,0,0,0.1)] border-b border-white/30 animate-slide-down">
                <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4 py-4 md:px-6 md:py-3 w-full">
                    <div className="flex justify-between items-center w-full md:w-auto mb-4 md:mb-0">
                        <div style={styles.logoContainer}>
                            <img
                                src="/logo.jpeg"
                                alt="Logo"
                                style={styles.logoImage}
                            />
                            <h1 style={styles.logo}>H&M Portal</h1>
                        </div>
                        {/* Hamburger Icon */}
                        <button
                            className="md:hidden text-2xl text-gray-700 focus:outline-none"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            {menuOpen ? "✖" : "☰"}
                        </button>
                    </div>

                    {/* Links and Buttons (Hidden on mobile unless menu is open) */}
                    <div className={`${menuOpen ? "flex" : "hidden"} md:flex flex-col md:flex-row w-full md:w-auto md:flex-1 md:justify-between items-center gap-4 md:gap-0 transition-all duration-300`}>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 w-full md:w-auto text-center md:mx-auto">
                            <a href="#" style={styles.navLink} className="nav-link-animated text-sm md:text-base w-full md:w-auto py-2 md:py-0 border-b md:border-none border-gray-100" onClick={() => setMenuOpen(false)}>Home</a>
                            <a href="#about" style={styles.navLink} className="nav-link-animated text-sm md:text-base w-full md:w-auto py-2 md:py-0 border-b md:border-none border-gray-100" onClick={() => setMenuOpen(false)}>About</a>
                            <a href="#announcements" style={styles.navLink} className="nav-link-animated text-sm md:text-base w-full md:w-auto py-2 md:py-0 border-b md:border-none border-gray-100" onClick={() => setMenuOpen(false)}>Announcements</a>
                            <a href="#placement" style={styles.navLink} className="nav-link-animated text-sm md:text-base w-full md:w-auto py-2 md:py-0" onClick={() => setMenuOpen(false)}>Placement</a>
                        </div>
                        <div className="flex flex-row items-center justify-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                            <button style={styles.navBtn} className="hover-lift text-sm md:text-base whitespace-nowrap flex-1 md:flex-none" onClick={() => router.push("/student")}>
                                Student Login
                            </button>
                            <button style={styles.navBtnOutline} className="hover-lift text-sm md:text-base whitespace-nowrap flex-1 md:flex-none" onClick={() => router.push("/admin")}>
                                Admin Login
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="animate-slide-up">
                <header className="px-4 md:px-[5%] py-12 md:py-20 text-center flex flex-col justify-center items-center relative overflow-hidden min-h-[65vh] animate-bg-pan" style={{
                    backgroundImage: "radial-gradient(circle at top left, rgba(139, 92, 246, 0.15) 0%, transparent 40%), radial-gradient(circle at bottom right, rgba(236, 72, 153, 0.15) 0%, transparent 40%), linear-gradient(-45deg, #fdf4ff, #faf5ff, #fff1f2, #ffffff)",
                    backgroundSize: "400% 400%",
                }}>
                    {/* Background Blobs */}
                    <div className="animate-blob" style={{ position: "absolute", top: "0%", left: "0%", width: "400px", height: "400px", background: "rgba(139, 92, 246, 0.4)", borderRadius: "50%", filter: "blur(70px)", zIndex: 0 }}></div>
                    <div className="animate-blob animation-delay-2000" style={{ position: "absolute", top: "10%", right: "10%", width: "300px", height: "300px", background: "rgba(236, 72, 153, 0.4)", borderRadius: "50%", filter: "blur(70px)", zIndex: 0 }}></div>
                    <div className="animate-blob animation-delay-4000" style={{ position: "absolute", bottom: "10%", left: "20%", width: "250px", height: "250px", background: "rgba(99, 102, 241, 0.4)", borderRadius: "50%", filter: "blur(70px)", zIndex: 0 }}></div>

                    <div className="max-w-[800px] relative z-10 w-full">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold mb-4 sm:mb-5 leading-tight text-gray-900">
                            Welcome to Our Website Portal <br className="hidden sm:block" />
                            <span className="text-gradient-animated block sm:inline mt-2 sm:mt-0" style={{ fontSize: "inherit", fontWeight: "inherit" }}>(Honors & Minors Portal)</span>
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-10 px-2 sm:px-0">
                            Unlock new academic horizons. Specialize in your field or explore
                            interdisciplinary passions.
                        </p>
                        <button style={styles.ctaButton} className="hover-lift animate-float-smooth animate-pulse-glow text-sm sm:text-base md:text-lg" onClick={() => router.push("/student/register")}>
                            Get Started
                        </button>
                    </div>
                </header>
            </div>

            {/* Information Section */}
            <section id="about" className="px-4 sm:px-8 md:px-[10%] py-12 md:py-20 reveal-stagger delay-100">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10 md:mb-16 text-gray-900">Explore Our Programs</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                    {/* Honors Card */}
                    <div style={styles.card} className="glass-panel hover-lift">
                        <div style={styles.imageContainer}>
                            <img
                                src="/images/honandmin.jpeg"
                                alt="Honors Degree"
                                className="image-zoom"
                            />
                        </div>
                        <h3 className="text-xl md:text-2xl font-semibold m-5 text-gray-900">Honors Degree</h3>
                        <p className="text-gray-600 m-5 mb-8 leading-relaxed">
                            Dive deeper into your major. The Honors program offers
                            advanced coursework and research opportunities for students
                            who want to excel in their core discipline.
                        </p>
                    </div>

                    {/* Minors Card */}
                    <div style={styles.card} className="glass-panel hover-lift">
                        <div style={styles.imageContainer}>
                            <img
                                src="/images/hm2.jpeg"
                                alt="Minors Degree"
                                className="image-zoom"
                            />
                        </div>
                        <h3 className="text-xl md:text-2xl font-semibold m-5 text-gray-900">Minors Degree</h3>
                        <p className="text-gray-600 m-5 mb-8 leading-relaxed">
                            Broaden your skillset. A Minor allows you to gain
                            expertise in a secondary field, making you a more versatile
                            and competitive professional.
                        </p>
                    </div>
                </div>
            </section>

            {/* Eligibility Section */}
            <section className="px-4 sm:px-8 md:px-[10%] py-12 md:py-20 reveal-stagger delay-200 bg-[#f8f9fa]">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10 md:mb-16 text-gray-900">Eligibility Criteria</h2>
                <div className="max-w-[800px] mx-auto p-6 md:p-10 rounded-2xl glass-panel hover-lift">
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 mb-8 items-start">
                        <span style={styles.checkIcon} className="shrink-0">✅</span>
                        <div>
                            <h4 className="text-lg font-semibold mb-1 text-gray-900">Academic Year</h4>
                            <p className="text-gray-600 m-0">
                                Student is <strong>2nd Year Compulsory</strong>.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 mb-8 items-start">
                        <span style={styles.checkIcon} className="shrink-0">🏆</span>
                        <div>
                            <h4 className="text-lg font-semibold mb-1 text-gray-900">CGPA Requirement</h4>
                            <p className="text-gray-600 m-0">
                                CGPA must be <strong>greater than or equal to 8.0</strong>.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 mb-0 items-start">
                        <span style={styles.checkIcon} className="shrink-0">📚</span>
                        <div>
                            <h4 className="text-lg font-semibold mb-1 text-gray-900">No Backlogs</h4>
                            <p className="text-gray-600 m-0">
                                Should have cleared all previous semesters without any active backlogs.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Announcements Section */}
            <section id="announcements" className="px-4 sm:px-8 md:px-[10%] py-12 md:py-20 reveal-stagger delay-300">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10 md:mb-16 text-gray-900">Latest Announcements</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1000px] mx-auto">
                    <div style={styles.announcementCard} className="glass-panel hover-lift">
                        <span style={styles.dateTag} className="animate-pulse-glow">New</span>
                        <h4 className="text-lg font-semibold mb-2 text-gray-900">Fall 2024 Enrollment Open</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">Registration for Honors & Minors programs starts from October 1st.</p>
                    </div>
                    <div style={styles.announcementCard} className="glass-panel hover-lift">
                        <span style={{ ...styles.dateTag, background: "#f3f4f6", color: "#666" }}>Sep 15</span>
                        <h4 className="text-lg font-semibold mb-2 text-gray-900">Orientation Session</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">Join us for a virtual orientation session to learn more about the courses.</p>
                    </div>
                    <div style={styles.announcementCard} className="glass-panel hover-lift">
                        <span style={{ ...styles.dateTag, background: "#f3f4f6", color: "#666" }}>Aug 30</span>
                        <h4 className="text-lg font-semibold mb-2 text-gray-900">Curriculum Update</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">New minor programs in Data Science and AI have been introduced.</p>
                    </div>
                </div>
            </section>

            {/* Placement Section */}
            <section id="placement" className="px-4 sm:px-8 md:px-[10%] py-12 md:py-20 reveal-stagger delay-400 bg-[#f0f9ff]">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10 md:mb-16 text-gray-900">Placement Opportunities</h2>
                <div className="max-w-[800px] mx-auto text-center">
                    <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-10">
                        Students with Honors & Minors degrees have a competitive edge in placements.
                        Top recruiters value the specialized skills gained through these programs.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10">
                        <div style={styles.statCard} className="glass-panel hover-lift">
                            <h3 style={styles.statNumber}>95%</h3>
                            <p style={styles.statLabel}>Placement Rate</p>
                        </div>
                        <div style={styles.statCard} className="glass-panel hover-lift">
                            <h3 style={styles.statNumber}>12 LPA</h3>
                            <p style={styles.statLabel}>Avg Package</p>
                        </div>
                        <div style={styles.statCard} className="glass-panel hover-lift">
                            <h3 style={styles.statNumber}>50+</h3>
                            <p style={styles.statLabel}>Recruiters</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={styles.footer}>
                <p>&copy; 2024 University Honors & Minors Portal. All rights reserved.</p>
            </footer>
        </div>
    );
}

const styles = {
    container: {
        fontFamily: "'Inter', sans-serif",
        color: "#333",
        lineHeight: 1.6,
        overflowX: "hidden" as const,
    },
    logoContainer: {
        display: "flex",
        alignItems: "center",
        gap: 10,
    },
    logoImage: {
        height: 50,
        width: "auto",
        objectFit: "contain" as const,
    },
    logo: {
        fontSize: 20,
        fontWeight: "bold",
        margin: 0,
        background: "linear-gradient(90deg, #8b5cf6, #ec4899)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
    },
    navLink: {
        color: "#374151",
        cursor: "pointer",
        transition: "color 0.2s",
        textDecoration: "none",
        position: "relative" as const,
        fontWeight: 600,
    },
    navBtn: {
        padding: "8px 16px",
        background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
        color: "white",
        border: "none",
        borderRadius: 50,
        cursor: "pointer",
        fontWeight: 600,
        transition: "transform 0.2s",
    },
    navBtnOutline: {
        padding: "8px 16px",
        background: "transparent",
        color: "#8b5cf6",
        border: "2px solid #8b5cf6",
        borderRadius: 50,
        cursor: "pointer",
        fontWeight: 600,
    },
    ctaButton: {
        padding: "12px 32px",
        background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
        color: "white",
        border: "none",
        borderRadius: 50,
        cursor: "pointer",
        fontWeight: 600,
        boxShadow: "0 10px 25px rgba(236, 72, 153, 0.3)",
        transition: "all 0.3s ease",
    },
    card: {
        borderRadius: 24,
        overflow: "hidden",
        transition: "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease",
    },
    imageContainer: {
        height: 200,
        overflow: "hidden",
        background: "#f3f4f6",
    },
    checkIcon: {
        fontSize: 24,
        background: "#fce7f3",
        width: 50,
        height: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "50%",
    },
    footer: {
        background: "#111",
        color: "white",
        textAlign: "center" as const,
        padding: 40,
    },
    announcementCard: {
        padding: 25,
        borderRadius: 20,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
    },
    dateTag: {
        display: "inline-block",
        background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
        color: "white",
        padding: "4px 12px",
        borderRadius: 50,
        fontSize: 12,
        fontWeight: 600,
        marginBottom: 10,
        boxShadow: "0 2px 10px rgba(236, 72, 153, 0.2)",
    },
    statCard: {
        padding: 30,
        borderRadius: 20,
        textAlign: "center" as const,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
    },
    statNumber: {
        fontSize: 36,
        fontWeight: 800,
        background: "linear-gradient(90deg, #8b5cf6, #ec4899)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 16,
        color: "#6b7280",
        fontWeight: 500,
    },
};