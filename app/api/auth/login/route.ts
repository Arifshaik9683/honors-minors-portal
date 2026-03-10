import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import clientPromise from '@/lib/mongodb';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
        }

        // Validate email ends with @vishnu.edu.in
        if (!email.endsWith('@vishnu.edu.in')) {
            return NextResponse.json({ message: 'Only @vishnu.edu.in emails are allowed' }, { status: 403 });
        }

        const client = await clientPromise;
        const db = client.db("honors_portal");
        const collection = db.collection('students');

        const student = await collection.findOne({ email });

        if (!student) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        const isPasswordValid = await bcrypt.compare(password, student.password);

        if (!isPasswordValid) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        // Generate JWT token
        const token = jwt.sign(
            { studentId: student._id, email: student.email, name: student.name },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1d' }
        );

        return NextResponse.json({
            message: 'Login successful',
            token,
            student: {
                name: student.name,
                email: student.email,
                enrolledSubjectId: student.enrolledSubjectId
            }
        }, { status: 200 });

    } catch (error: any) {
        console.error('Login error:', error);
        if (error.name === 'MongoServerSelectionError' || error.message?.includes('ECONNREFUSED') || error.message?.includes('ERR_SSL_TLSV1_ALERT_INTERNAL_ERROR')) {
            return NextResponse.json({ message: 'Database connection failed. Check MongoDB IP whitelist or credentials.' }, { status: 503 });
        }
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
