export interface Student {
    name: string;
    email: string;
    rollNumber: string;
    year: string; // "1", "2", "3", "4"
    section: string; // "A", "B", "C"
    password?: string;
    securityQuestion1?: string;
    answer1?: string;
    securityQuestion2?: string;
    answer2?: string;
    enrolledSubjectId?: number | null;
}

export interface Subject {
    id: number;
    name: string;
    description?: string;
    credits?: number;
    faculty: string; // "Assigned Teacher Name"
    timetable?: string;
    totalSeats: number;
    filledSeats: number;
}

export interface Enrollment {
    studentEmail: string;
    subjectId: number;
    enrolledAt: string;
}
