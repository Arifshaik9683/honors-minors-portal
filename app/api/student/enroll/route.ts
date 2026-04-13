import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
    try {
        const client = await clientPromise;
        const db = client.db('honors_portal');

        const body = await req.json();
        const { studentEmail, courseId } = body;

        if (!studentEmail || !courseId) {
            return NextResponse.json({ message: 'studentEmail and courseId are required' }, { status: 400 });
        }

        const studentsCollection = db.collection('students');
        const coursesCollection = db.collection('courses');
        const enrollmentsCollection = db.collection('enrollments');

        // Find student
        const studentRecord = await studentsCollection.findOne({ email: studentEmail });

        if (!studentRecord) {
            return NextResponse.json({ message: 'Student not found in database', success: false }, { status: 404 });
        }

        // Check passed: Users can freely dynamically select new courses and switch without manual override.

        // Find course
        let courseObjectId;
        try {
            courseObjectId = new ObjectId(courseId);
        } catch {
            // handle if courseId is a string but not an ObjectId. The frontend previously used string/number IDs.
            // If the course was created with our new API, it has an ObjectId string format.
            // Let's also check by string ID just in case
        }

        const courseQuery = courseObjectId ? { $or: [{ _id: courseObjectId }, { id: courseId }] } : { $or: [{ id: courseId }, { _id: courseId }] };
        const course = await coursesCollection.findOne(courseQuery);

        if (!course) {
            return NextResponse.json({ message: 'Course not found', success: false }, { status: 404 });
        }

        if (course.filledSeats >= course.totalSeats) {
            return NextResponse.json({ message: 'No seats remaining in this subject', success: false }, { status: 400 });
        }

        // Transaction-like updates (simplified for this task)
        const session = client.startSession();
        try {
            await session.withTransaction(async () => {
                const existingEnrollment = await enrollmentsCollection.findOne({ studentEmail }, { session });

                if (existingEnrollment) {
                    // Update old course seats
                    if (existingEnrollment.courseId) {
                        try {
                            const oldCourseObjectId = new ObjectId(existingEnrollment.courseId);
                            await coursesCollection.updateOne(
                                { _id: oldCourseObjectId },
                                { $inc: { filledSeats: -1 } },
                                { session }
                            );
                        } catch {}
                    }
                    
                    // Update existing enrollment
                    await enrollmentsCollection.updateOne(
                        { studentEmail },
                        { $set: { courseId: course._id.toString(), enrolledAt: new Date() } },
                        { session }
                    );
                } else {
                    // Insert new Enrollment
                    await enrollmentsCollection.insertOne({
                        studentEmail,
                        courseId: course._id.toString(),
                        enrolledAt: new Date()
                    }, { session });
                }

                // Update new Course seats
                await coursesCollection.updateOne(
                    { _id: course._id },
                    { $inc: { filledSeats: 1 } },
                    { session }
                );

                // Update Student record
                await studentsCollection.updateOne(
                    { _id: studentRecord._id },
                    { $set: { enrolledSubjectId: course._id.toString() } },
                    { session }
                );
            });
        } finally {
            await session.endSession();
        }

        return NextResponse.json({ message: 'Enrollment Successful', success: true }, { status: 201 });

    } catch (error) {
        console.error('Enrollment error:', error);
        return NextResponse.json({ message: 'Internal server error', success: false }, { status: 500 });
    }
}
