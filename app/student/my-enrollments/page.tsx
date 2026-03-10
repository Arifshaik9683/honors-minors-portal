"use client";

import { useEffect, useState } from "react";

export default function MyEnrollments() {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        const enrollments =
            JSON.parse(localStorage.getItem("enrollments") || "[]");
        setData(enrollments);
    }, []);

    return (
        <main style={{ padding: 40 }}>
            <h1>My Enrollments</h1>

            {data.length === 0 && <p>No courses enrolled.</p>}

            {data.map((c, i) => (
                <div key={i}>✅ {c.name}</div>
            ))}
        </main>
    );
}