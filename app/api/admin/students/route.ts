import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(req: Request) {
    try {
        const client = await clientPromise;
        const db = client.db('honors_portal');

        const students = await db.collection('students').find({}).toArray();

        const formatted = students.map(s => ({
            ...s,
            _id: s._id.toString(),
            id: s._id.toString(),
        }));

        return NextResponse.json(formatted, { status: 200 });
    } catch (error) {
        console.error('Error fetching students:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
