import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';

export async function POST(req: Request) {
    console.log("Register API called");
    try {
        const { name, email, password, phoneNumber, rollNumber, year, section, collegeName } = await req.json();

        if (!name || !email || !password || (!phoneNumber && !rollNumber) || !collegeName || !year || !section) {
            return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
        }
        const client = await clientPromise;
        const db = client.db("honors_portal");
        const collection = db.collection('students');

        // Check if email already exists
        const existingStudent = await collection.findOne({ email });
        if (existingStudent) {
            return NextResponse.json({ message: 'Email already registered' }, { status: 409 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await collection.insertOne({
            name,
            email,
            password: hashedPassword,
            phoneNumber: phoneNumber || rollNumber,
            rollNumber: rollNumber || phoneNumber,
            year,
            section,
            collegeName,
            createdAt: new Date(),
        });

        return NextResponse.json({ message: 'Student registered successfully', studentId: result.insertedId }, { status: 201 });
    } catch (error: any) {
        console.error('Registration error:', error);
        if (error.name === 'MongoServerSelectionError' || error.message?.includes('ECONNREFUSED') || error.message?.includes('ERR_SSL_TLSV1_ALERT_INTERNAL_ERROR')) {
            return NextResponse.json({ message: 'Database connection failed. Check MongoDB IP whitelist or credentials.' }, { status: 503 });
        }
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
