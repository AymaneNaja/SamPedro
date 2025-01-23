import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    const id = params?.id;

    if (!id) {
        return NextResponse.json({ error: 'Product ID is required.' }, { status: 400 });
    }

    try {
        const response = await fetch(`https://dummyjson.com/products/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Product not found.' }, { status: response.status });
        }

        const product = await response.json();
        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}
