import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: Request) {
    try {
        const client = await clientPromise;
        const db = client.db('honors_portal');

        // Fetch all courses
        const courses = await db.collection('courses').find({}).toArray();

        // Convert _id to string for the frontend, and add an 'id' field to be compatible with existing frontend code
        const formatted = courses.map(c => ({
            ...c,
            _id: c._id.toString(),
            id: c._id.toString()
        }));

        return NextResponse.json(formatted, { status: 200 });
    } catch (error) {
        console.error('Error fetching courses:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const client = await clientPromise;
        const db = client.db('honors_portal');

        // Expecting: subjectName, assignedFaculty, credits, totalSeats, description, timetable
        const body = await req.json();

        // Basic validation
        if (!body.subjectName || !body.assignedFaculty || !body.totalSeats) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const newCourse = {
            name: body.subjectName,
            faculty: body.assignedFaculty,
            credits: Number(body.credits) || 0,
            totalSeats: Number(body.totalSeats) || 0,
            filledSeats: 0,
            description: body.description || '',
            timetable: body.timetable || '',
            createdAt: new Date(),
        };

        const result = await db.collection('courses').insertOne(newCourse);

        if (result.acknowledged) {
            return NextResponse.json({ message: 'Course created', course: { ...newCourse, _id: result.insertedId.toString(), id: result.insertedId.toString() } }, { status: 201 });
        } else {
            return NextResponse.json({ message: 'Failed to create course' }, { status: 500 });
        }

    } catch (error) {
        console.error('Error creating course:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
