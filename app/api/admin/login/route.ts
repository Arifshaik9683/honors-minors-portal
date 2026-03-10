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

        const client = await clientPromise;
        const db = client.db("honors_portal");
        const collection = db.collection('admins');

        // Ensure role="admin"
        const admin = await collection.findOne({ email, role: 'admin' });

        if (!admin) {
            return NextResponse.json({ message: 'Invalid credentials or unauthorized' }, { status: 401 });
        }

        let isPasswordValid = false;
        // Check if it's a bcrypt hash
        if (admin.password && admin.password.startsWith('$2')) {
            isPasswordValid = await bcrypt.compare(password, admin.password);
        } else {
            // Fallback to plain text if records were seeded without hashing
            isPasswordValid = password === admin.password;
        }

        if (!isPasswordValid) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        // Generate JWT token
        const token = jwt.sign(
            { adminId: admin._id, email: admin.email, role: 'admin' },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1d' }
        );

        return NextResponse.json({
            message: 'Login successful',
            token,
            admin: { email: admin.email, role: admin.role }
        }, { status: 200 });

    } catch (error) {
        console.error('Admin login error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
