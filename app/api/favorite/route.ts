import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const favorites = await prisma.favorite.findMany({
            where: { userId: session.user.id },
        })
        return NextResponse.json(favorites)
    } catch (error) {
        console.error("Error fetching favorites:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}


export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    // Validate the session
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Parse request body
        const { productId } = await req.json();
        if (!productId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check if the favorite already exists
        const existingFavorite = await prisma.favorite.findFirst({
            where: {
                userId: session.user.id,
                productId,
            },
        });
        if (existingFavorite) {
            return NextResponse.json({ error: "Product already in favorites" }, { status: 409 });
        }

        // Add the product to favorites
        const newFavorite = await prisma.favorite.create({
            data: {
                userId: session.user.id,
                productId,
            },
        });

        // Ensure all IDs are strings
        const response = {
            ...newFavorite,
            id: String(newFavorite.id),
            userId: String(newFavorite.userId),
            productId: String(newFavorite.productId),
        };

        return NextResponse.json(response, { status: 201 });
    } catch (error) {
        console.error("Error adding favorite:", error.message);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = req.nextUrl.searchParams.get("id")

    if (!id) {
        return NextResponse.json({ error: "Favorite ID is required" }, { status: 400 })
    }

    try {
        await prisma.favorite.delete({
            where: { id, userId: session.user.id },
        })
        return NextResponse.json({ message: "Favorite deleted successfully" }, { status: 200 })
    } catch (error) {
        console.error("Error deleting favorite:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

