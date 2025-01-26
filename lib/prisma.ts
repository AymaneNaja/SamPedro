import { PrismaClient } from '@prisma/client';

// Define a type for the global object with the `prisma` property
declare global {
    var prisma: PrismaClient | undefined;
}

// Initialize Prisma Client
const prisma: PrismaClient = global.prisma || new PrismaClient();

// Store the Prisma Client in the global object in development
if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma;
}

export default prisma;