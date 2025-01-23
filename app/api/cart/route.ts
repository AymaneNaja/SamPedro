import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import prisma from "@/lib/prisma";

interface Session {
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        id?: string;
    };
}

export async function GET(req: NextRequest) {
    const session: Session | null = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const cartItems = await prisma.cart.findMany({
            where: { userId: session.user.id },
        });
        return NextResponse.json(cartItems);
    } catch (error) {
        console.error("Error fetching cart items:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session: Session | null = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        let body;
        try {
            body = await req.json();
        } catch {
            return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
        }

        const { productId, quantity, price } = body;

        if (!productId || quantity == null || price == null) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const existingCartItem = await prisma.cart.findFirst({
            where: {
                userId: session.user.id,
                productId,
            },
        });

        if (existingCartItem) {
            const updatedCartItem = await prisma.cart.update({
                where: { id: existingCartItem.id },
                data: { quantity: existingCartItem.quantity + quantity },
            });
            return NextResponse.json(updatedCartItem, { status: 200 });
        } else {
            const newCartItem = await prisma.cart.create({
                data: {
                    userId: session.user.id,
                    productId,
                    quantity,
                    price,
                },
            });
            return NextResponse.json(newCartItem, { status: 201 });
        }
    } catch (error) {
        console.error("Error adding item to cart:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Update the quantity of a cart item
export async function PUT(req: NextRequest) {
    const session: Session | null = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id, quantity } = await req.json();

        if (!id || quantity === undefined) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Update the cart item
        const updatedCartItem = await prisma.cart.update({
            where: {
                id,
            },
            data: {
                quantity,
            },
        });

        return NextResponse.json(updatedCartItem, { status: 200 });
    } catch (error) {
        console.error("Error updating cart item:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const session: Session | null = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
        return NextResponse.json({ error: "Cart item ID is required" }, { status: 400 });
    }

    try {
        await prisma.cart.delete({
            where: { id, userId: session.user.id },
        });
        return NextResponse.json({ message: "Cart item deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting cart item:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
