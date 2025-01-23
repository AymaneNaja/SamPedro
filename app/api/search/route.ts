import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url); // Extract search parameters from the request URL
    const query = searchParams.get('q'); // Get the 'q' parameter

    if (!query) {
        return NextResponse.json({ error: 'Query parameter "q" is required.' }, { status: 400 });
    }

    try {
        const response = await fetch(`https://dummyjson.com/products/search?q=${query}&limit=0`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Products not found.' }, { status: response.status });
        }

        const products = await response.json();
        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}
