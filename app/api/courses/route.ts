import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import jwt from 'jsonwebtoken';

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

        if (decoded.role !== 'admin') {
            return NextResponse.json({ message: 'Forbidden: Admins only' }, { status: 403 });
        }

        const { name, type, description, credits } = await req.json();

        if (!name || !type) {
            return NextResponse.json({ message: 'Course name and type are required' }, { status: 400 });
        }

        if (type !== 'honors' && type !== 'minors') {
            return NextResponse.json({ message: 'Course type must be honors or minors' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("honors_portal");
        const collection = db.collection('courses');

        const result = await collection.insertOne({
            name,
            type,
            description,
            credits,
            createdBy: decoded.adminId,
            createdAt: new Date(),
        });

        return NextResponse.json({ message: 'Course created successfully', courseId: result.insertedId }, { status: 201 });
    } catch (error) {
        console.error('Course creation error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("honors_portal");
        const courses = await db.collection('courses').find({}).toArray();
        return NextResponse.json({ courses }, { status: 200 });
    } catch (error) {
        console.error('Error fetching courses:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
