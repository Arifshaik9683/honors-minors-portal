import { courses } from "../../data/courses";

export default function Courses() {
    return (
        <main style={{ padding: 40 }}>
            <h1>Available Courses</h1>

            {courses.map((c) => (
                <div key={c.id} style={{ margin: 10 }}>
                    {c.name}
                </div>
            ))}
        </main>
    );
}