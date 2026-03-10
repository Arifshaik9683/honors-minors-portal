import { Student, Subject } from "../types";

const STUDENTS_KEY = "system_students_v2";
const SUBJECTS_KEY = "system_subjects";

const INITIAL_SUBJECTS: Subject[] = [
    {
        id: 1,
        name: "Artificial Intelligence",
        faculty: "Dr. Sarah Jensen",
        description: "Explore the foundations of AI, including neural networks, natural language processing, and computer vision. Build intelligent systems that learn and adapt.",
        credits: 4,
        totalSeats: 60,
        filledSeats: 0
    },
    {
        id: 2,
        name: "Machine Learning",
        faculty: "Prof. Michael Chen",
        description: "Dive deep into algorithms that enable computers to learn from data. Cover supervised, unsupervised, and reinforcement learning techniques.",
        credits: 4,
        totalSeats: 55,
        filledSeats: 0
    },
    {
        id: 3,
        name: "Cyber Security",
        faculty: "Dr. Alan Turing",
        description: "Learn to protect systems and networks from digital attacks. Topics include cryptography, network security, and ethical hacking.",
        credits: 3,
        totalSeats: 45,
        filledSeats: 0
    },
    {
        id: 4,
        name: "Data Science",
        faculty: "Prof. Emily Davis",
        description: "Master the art of extracting insights from data. combine statistics, programming, and domain expertise to solve complex problems.",
        credits: 3,
        totalSeats: 50,
        filledSeats: 0
    },
];

export const Storage = {

    initialize: () => {
        if (typeof window === "undefined") return;
        if (!localStorage.getItem(SUBJECTS_KEY)) {
            localStorage.setItem(SUBJECTS_KEY, JSON.stringify(INITIAL_SUBJECTS));
        }
    },

    getStudents: (): Student[] => {
        if (typeof window === "undefined") return [];
        return JSON.parse(localStorage.getItem(STUDENTS_KEY) || "[]");
    },

    saveStudent: (student: Student) => {
        const students = Storage.getStudents();
        const existing = students.find(s => s.email === student.email);
        if (existing) {
            // Update existing
            const updated = students.map(s => s.email === student.email ? { ...s, ...student } : s);
            localStorage.setItem(STUDENTS_KEY, JSON.stringify(updated));
        } else {
            // Add new
            students.push(student);
            localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
        }
    },

    getSubjects: (): Subject[] => {
        if (typeof window === "undefined") return [];
        return JSON.parse(localStorage.getItem(SUBJECTS_KEY) || "[]");
    },

    saveSubjects: (subjects: Subject[]) => {
        localStorage.setItem(SUBJECTS_KEY, JSON.stringify(subjects));
    },

    enrollStudentInSubject: (studentEmail: string, subjectId: number): { success: boolean, message: string } => {
        const students = Storage.getStudents();
        const subjects = Storage.getSubjects();

        const studentIndex = students.findIndex(s => s.email === studentEmail);
        if (studentIndex === -1) return { success: false, message: "Student not found" };

        const student = students[studentIndex];

        // 1. Check Year Rule (Strict Backend Validation)
        if (student.year !== "2") {
            return { success: false, message: "Only 2nd Year students are allowed to enroll in minor subjects." };
        }

        // 2. Check existing enrollment
        if (student.enrolledSubjectId) {
            return { success: false, message: "You are already enrolled in a subject." };
        }

        const subjectIndex = subjects.findIndex(s => s.id === subjectId);
        if (subjectIndex === -1) return { success: false, message: "Subject not found" };

        const subject = subjects[subjectIndex];

        // 3. Check Seats
        if (subject.filledSeats >= subject.totalSeats) {
            return { success: false, message: "No seats remaining in this subject." };
        }

        // Perform Enrollment
        students[studentIndex].enrolledSubjectId = subjectId;
        subjects[subjectIndex].filledSeats += 1;

        Storage.saveStudentsList(students);
        Storage.saveSubjects(subjects);

        // Update individual session storage for current user if needed (UI sync)
        localStorage.setItem("student", JSON.stringify(students[studentIndex]));

        return { success: true, message: "Enrollment Successful" };
    },

    // Helper to save full list
    saveStudentsList: (students: Student[]) => {
        localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
    },

    // Add new subject
    addSubject: (newSubject: Omit<Subject, 'id' | 'filledSeats'>) => {
        const subjects = Storage.getSubjects();
        const maxId = subjects.reduce((max, s) => Math.max(max, s.id), 0);
        const subject: Subject = {
            ...newSubject,
            id: maxId + 1,
            filledSeats: 0
        };
        subjects.push(subject);
        Storage.saveSubjects(subjects);
    },

    deleteSubject: (id: number) => {
        const subjects = Storage.getSubjects();
        const updated = subjects.filter(s => s.id !== id);
        Storage.saveSubjects(updated);
        // Note: Ideally we should update students who were enrolled in this subject too, but for now we skip that complexity unless asked.
    }
};
