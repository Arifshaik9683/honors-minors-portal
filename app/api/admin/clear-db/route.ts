import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db();

        // Clear students collection
        const studentsResult = await db.collection('students').deleteMany({});

        // Clear admins collection
        const adminsResult = await db.collection('admins').deleteMany({});

        return NextResponse.json({
            message: 'Database successfully cleared',
            deletedStudents: studentsResult.deletedCount,
            deletedAdmins: adminsResult.deletedCount
        });
    } catch (error: any) {
        console.error('Error clearing database:', error);
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}
