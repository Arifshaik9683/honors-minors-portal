"use client";

import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    return (
        <div style={styles.container}>
            {/* Navbar */}
            <nav style={styles.navbar} className="animate-slide-down">
                <div style={styles.logoContainer}>
                    <img
                        src="/logo.jpeg"
                        alt="Logo"
                        style={styles.logoImage}
                    />
                    <h1 style={styles.logo}>H&M Portal</h1>
                </div>
                <div style={styles.navLinks}>
                    <a href="#" style={styles.navLink} className="nav-link-animated">Home</a>
                    <a href="#about" style={styles.navLink} className="nav-link-animated">About</a>
                    <a href="#announcements" style={styles.navLink} className="nav-link-animated">Announcements</a>
                    <a href="#placement" style={styles.navLink} className="nav-link-animated">Placement</a>
                </div>
                <div style={styles.authButtons}>
                    <button style={styles.navBtn} className="hover-lift" onClick={() => router.push("/student")}>
                        Student Login
                    </button>
                    <button style={styles.navBtnOutline} className="hover-lift" onClick={() => router.push("/admin")}>
                        Admin Login
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="animate-slide-up">
                <header style={styles.hero} className="animate-bg-pan">
                    {/* Background Blobs */}
                    <div className="animate-blob" style={{ position: "absolute", top: "0%", left: "0%", width: "400px", height: "400px", background: "rgba(139, 92, 246, 0.4)", borderRadius: "50%", filter: "blur(70px)", zIndex: 0 }}></div>
                    <div className="animate-blob animation-delay-2000" style={{ position: "absolute", top: "10%", right: "10%", width: "300px", height: "300px", background: "rgba(236, 72, 153, 0.4)", borderRadius: "50%", filter: "blur(70px)", zIndex: 0 }}></div>
                    <div className="animate-blob animation-delay-4000" style={{ position: "absolute", bottom: "10%", left: "20%", width: "250px", height: "250px", background: "rgba(99, 102, 241, 0.4)", borderRadius: "50%", filter: "blur(70px)", zIndex: 0 }}></div>

                    <div style={{ ...styles.heroContent, position: "relative", zIndex: 1 }}>
                        <h1 style={styles.heroTitle}>
                            Welcome to Our Website Portal <br />
                            <span className="text-gradient-animated" style={{ fontSize: "inherit", fontWeight: "inherit" }}>(Honors & Minors Portal)</span>
                        </h1>
                        <p style={styles.heroSubtitle}>
                            Unlock new academic horizons. Specialize in your field or explore
                            interdisciplinary passions.
                        </p>
                        <button style={styles.ctaButton} className="hover-lift animate-float-smooth animate-pulse-glow" onClick={() => router.push("/student/register")}>
                            Get Started
                        </button>
                    </div>
                </header>
            </div>

            {/* Information Section */}
            <section id="about" style={styles.section} className="reveal-stagger delay-100">
                <h2 style={styles.sectionTitle}>Explore Our Programs</h2>
                <div style={styles.grid}>
                    {/* Honors Card */}
                    <div style={styles.card} className="glass-panel hover-lift">
                        <div style={styles.imageContainer}>
                            <img
                                src="/images/honandmin.jpeg"
                                alt="Honors Degree"
                                className="image-zoom"
                            />
                        </div>
                        <h3 style={styles.cardTitle}>Honors Degree</h3>
                        <p style={styles.cardText}>
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
                        <h3 style={styles.cardTitle}>Minors Degree</h3>
                        <p style={styles.cardText}>
                            Broaden your skillset. A Minor allows you to gain
                            expertise in a secondary field, making you a more versatile
                            and competitive professional.
                        </p>
                    </div>
                </div>
            </section>

            {/* Eligibility Section */}
            <section style={{ ...styles.section, background: "#f8f9fa" }} className="reveal-stagger delay-200">
                <h2 style={styles.sectionTitle}>Eligibility Criteria</h2>
                <div style={styles.eligibilityContainer} className="glass-panel hover-lift">
                    <div style={styles.criteriaItem}>
                        <span style={styles.checkIcon}>✅</span>
                        <div>
                            <h4 style={styles.criteriaTitle}>Academic Year</h4>
                            <p style={styles.criteriaText}>
                                Student is <strong>2nd Year Compulsory</strong>.
                            </p>
                        </div>
                    </div>
                    <div style={styles.criteriaItem}>
                        <span style={styles.checkIcon}>🏆</span>
                        <div>
                            <h4 style={styles.criteriaTitle}>CGPA Requirement</h4>
                            <p style={styles.criteriaText}>
                                CGPA must be <strong>greater than or equal to 8.0</strong>.
                            </p>
                        </div>
                    </div>
                    <div style={styles.criteriaItem}>
                        <span style={styles.checkIcon}>📚</span>
                        <div>
                            <h4 style={styles.criteriaTitle}>No Backlogs</h4>
                            <p style={styles.criteriaText}>
                                Should have cleared all previous semesters without any active backlogs.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Announcements Section */}
            <section id="announcements" style={styles.section} className="reveal-stagger delay-300">
                <h2 style={styles.sectionTitle}>Latest Announcements</h2>
                <div style={styles.announcementContainer}>
                    <div style={styles.announcementCard} className="glass-panel hover-lift">
                        <span style={styles.dateTag} className="animate-pulse-glow">New</span>
                        <h4 style={styles.announcementTitle}>Fall 2024 Enrollment Open</h4>
                        <p style={styles.announcementText}>Registration for Honors & Minors programs starts from October 1st.</p>
                    </div>
                    <div style={styles.announcementCard} className="glass-panel hover-lift">
                        <span style={{ ...styles.dateTag, background: "#f3f4f6", color: "#666" }}>Sep 15</span>
                        <h4 style={styles.announcementTitle}>Orientation Session</h4>
                        <p style={styles.announcementText}>Join us for a virtual orientation session to learn more about the courses.</p>
                    </div>
                    <div style={styles.announcementCard} className="glass-panel hover-lift">
                        <span style={{ ...styles.dateTag, background: "#f3f4f6", color: "#666" }}>Aug 30</span>
                        <h4 style={styles.announcementTitle}>Curriculum Update</h4>
                        <p style={styles.announcementText}>New minor programs in Data Science and AI have been introduced.</p>
                    </div>
                </div>
            </section>

            {/* Placement Section */}
            <section id="placement" style={{ ...styles.section, background: "#f0f9ff" }} className="reveal-stagger delay-400">
                <h2 style={styles.sectionTitle}>Placement Opportunities</h2>
                <div style={styles.heroContent}>
                    <p style={{ ...styles.heroSubtitle, marginBottom: 30 }}>
                        Students with Honors & Minors degrees have a competitive edge in placements.
                        Top recruiters value the specialized skills gained through these programs.
                    </p>
                    <div style={styles.grid}>
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
    navbar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 5%",
        position: "sticky" as const,
        top: 0,
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        zIndex: 100,
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
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
    navLinks: {
        display: "flex",
        gap: 30,
        alignItems: "center",
    },
    navLink: {
        fontSize: 16,
        fontWeight: 600,
        color: "#374151",
        cursor: "pointer",
        transition: "color 0.2s",
        textDecoration: "none",
        position: "relative" as const,
    },
    authButtons: {
        display: "flex",
        gap: 15,
    },
    navBtn: {
        padding: "10px 20px",
        background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
        color: "white",
        border: "none",
        borderRadius: 50,
        cursor: "pointer",
        fontWeight: 600,
        transition: "transform 0.2s",
    },
    navBtnOutline: {
        padding: "10px 20px",
        background: "transparent",
        color: "#8b5cf6",
        border: "2px solid #8b5cf6",
        borderRadius: 50,
        cursor: "pointer",
        fontWeight: 600,
    },
    hero: {
        padding: "80px 5%",
        textAlign: "center" as const,
        backgroundImage: "radial-gradient(circle at top left, rgba(139, 92, 246, 0.15) 0%, transparent 40%), radial-gradient(circle at bottom right, rgba(236, 72, 153, 0.15) 0%, transparent 40%), linear-gradient(-45deg, #fdf4ff, #faf5ff, #fff1f2, #ffffff)",
        backgroundSize: "400% 400%",
        minHeight: "65vh",
        display: "flex",
        flexDirection: "column" as const,
        justifyContent: "center",
        alignItems: "center",
        position: "relative" as const,
        overflow: "hidden" as const,
    },
    heroContent: {
        maxWidth: 800,
    },
    heroTitle: {
        fontSize: 48,
        fontWeight: 800,
        marginBottom: 20,
        lineHeight: 1.2,
    },
    heroSubtitle: {
        fontSize: 20,
        color: "#666",
        marginBottom: 40,
    },
    ctaButton: {
        padding: "16px 40px",
        fontSize: 18,
        background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
        color: "white",
        border: "none",
        borderRadius: 50,
        cursor: "pointer",
        fontWeight: 600,
        boxShadow: "0 10px 25px rgba(236, 72, 153, 0.3)",
        transition: "all 0.3s ease",
    },
    section: {
        padding: "80px 10%",
    },
    sectionTitle: {
        fontSize: 36,
        fontWeight: 700,
        textAlign: "center" as const,
        marginBottom: 60,
        color: "#111",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 40,
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
    cardTitle: {
        fontSize: 24,
        margin: "20px 20px 10px",
    },
    cardText: {
        color: "#666",
        margin: "0 20px 30px",
        lineHeight: 1.6,
    },
    eligibilityContainer: {
        maxWidth: 800,
        margin: "0 auto",
        padding: 40,
        borderRadius: 20,
    },
    criteriaItem: {
        display: "flex",
        gap: 20,
        marginBottom: 30,
        alignItems: "flex-start",
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
    criteriaTitle: {
        fontSize: 18,
        fontWeight: 600,
        marginBottom: 5,
        margin: 0,
    },
    criteriaText: {
        color: "#666",
        margin: 0,
    },
    footer: {
        background: "#111",
        color: "white",
        textAlign: "center" as const,
        padding: 40,
    },
    announcementContainer: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 20,
        maxWidth: 1000,
        margin: "0 auto",
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
    announcementTitle: {
        fontSize: 18,
        fontWeight: 600,
        marginBottom: 8,
        color: "#111",
    },
    announcementText: {
        fontSize: 14,
        color: "#666",
        lineHeight: 1.5,
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