import { PrismaAdapter } from "@auth/prisma-adapter"
import type { NextAuthOptions } from "next-auth"
import prisma from "@/lib/prisma"
import { verify } from "argon2"
import CredentialsProvider from "next-auth/providers/credentials"
import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import rateLimit from "express-rate-limit"
import type { NextApiRequest, NextApiResponse } from "next"
import NextAuth from "next-auth"

// Rate limiter configuration
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // Max 5 requests per windowMs
    message: "Too many requests. Please try again later.",
})

// Apply rate limiting middleware
const applyRateLimit = (req: NextApiRequest, res: NextApiResponse) => {
    return new Promise((resolve, reject) => {
        limiter(req as any, res as any, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve(null)
            }
        })
    })
}

export const authOptions: NextAuthOptions = {
    debug: process.env.NODE_ENV === "development",
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "database",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        updateAge: 24 * 60 * 60, // 24 hours
    },
    pages: {
        signIn: "/sign-in",
    },
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "hello@example.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        console.error("Email and password are required.")
                        return null // Return null to indicate authentication failure
                    }

                    console.log("Fetching user from database...")
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email },
                        select: { id: true, email: true, name: true, password: true },
                    })

                    if (!user) {
                        console.error("User not found for email:", credentials.email)
                        return null // Return null to indicate authentication failure
                    }

                    if (!user.password) {
                        console.error("No password found for user:", user.email)
                        return null // Return null to indicate authentication failure
                    }

                    console.log("Verifying password...")
                    const isPasswordValid = await verify(user.password, credentials.password)
                    if (!isPasswordValid) {
                        console.error("Invalid password for user:", user.email)
                        return null // Return null to indicate authentication failure
                    }

                    console.log("User authenticated successfully:", user.email)
                    return user // Return the user object on successful authentication
                } catch (error) {
                    console.error("Authorization error:", error)
                    throw new Error("An error occurred during login. Please try again.") // Throw an error for unexpected issues
                }
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                },
            }
        },
        async jwt({ token, user }) {
            if (user) {
                return {
                    ...token,
                    id: user.id,
                }
            }
            return token
        },
    },
    cookies: {
        sessionToken: {
            name: "__Secure-next-auth.session-token",
            options: {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
            },
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    // Apply rate limiting to the credentials provider
    if (
        req.method === "POST" &&
        req.query.nextauth?.includes("callback") &&
        req.query.nextauth?.includes("credentials")
    ) {
        try {
            await applyRateLimit(req, res)
        } catch (error) {
            return res.status(429).json({ message: "Too many requests. Please try again later." })
        }
    }

    return NextAuth(req, res, authOptions)
}

