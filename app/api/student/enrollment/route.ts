import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json({ message: 'Email required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('honors_portal');
        
        const enrollment = await db.collection('enrollments').findOne({ studentEmail: email });
        
        if (!enrollment) {
            return NextResponse.json(null, { status: 200 });
        }
        
        return NextResponse.json(enrollment, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
