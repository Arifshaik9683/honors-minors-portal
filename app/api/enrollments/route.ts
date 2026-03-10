import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        let decoded: any;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        } catch (e) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
        }

        if (!decoded.studentId) {
            return NextResponse.json({ message: 'Forbidden: Students only' }, { status: 403 });
        }

        const { courseId } = await req.json();

        if (!courseId) {
            return NextResponse.json({ message: 'Course ID is required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("honors_portal");

        let courseObjectId;
        try {
            courseObjectId = new ObjectId(courseId);
        } catch (e) {
            return NextResponse.json({ message: 'Invalid Course ID' }, { status: 400 });
        }

        const course = await db.collection('courses').findOne({ _id: courseObjectId });
        if (!course) {
            return NextResponse.json({ message: 'Course not found' }, { status: 404 });
        }

        const collection = db.collection('enrollments');

        const existingEnrollment = await collection.findOne({
            studentId: decoded.studentId,
            courseId: courseId
        });

        if (existingEnrollment) {
            return NextResponse.json({ message: 'Already enrolled in this course' }, { status: 409 });
        }

        const result = await collection.insertOne({
            studentId: decoded.studentId,
            courseId: courseId,
            enrolledAt: new Date(),
        });

        return NextResponse.json({ message: 'Enrolled successfully', enrollmentId: result.insertedId }, { status: 201 });
    } catch (error) {
        console.error('Enrollment error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        let decoded: any;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        } catch (e) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
        }

        if (!decoded.studentId) {
            return NextResponse.json({ message: 'Forbidden: Students only' }, { status: 403 });
        }

        const client = await clientPromise;
        const db = client.db("honors_portal");
        const enrollments = await db.collection('enrollments').find({ studentId: decoded.studentId }).toArray();

        return NextResponse.json({ enrollments }, { status: 200 });
    } catch (error) {
        console.error('Error fetching enrollments:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
