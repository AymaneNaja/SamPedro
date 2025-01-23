import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcrypt'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json()

        // Validate email and password
        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 })
        }

        // Hash password
        const hashedPassword = await hash(password, 10)

        // Create new user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        })

        // Return user data (excluding password)
        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
            }
        }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

