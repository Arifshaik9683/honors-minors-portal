import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        if (!id || !ObjectId.isValid(id)) {
            return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('honors_portal');
        const body = await req.json();

        if (!body.subjectName || !body.assignedFaculty || !body.totalSeats) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const updateData = {
            name: body.subjectName,
            faculty: body.assignedFaculty,
            credits: Number(body.credits) || 0,
            totalSeats: Number(body.totalSeats) || 0,
            description: body.description || '',
            timetable: body.timetable || '',
            updatedAt: new Date(),
        };

        const result = await db.collection('courses').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount > 0) {
            return NextResponse.json({
                message: 'Course updated successfully',
                id: id,
                ...updateData
            }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'Course not found' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error updating course:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
