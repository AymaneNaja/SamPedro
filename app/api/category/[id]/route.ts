import { NextResponse } from 'next/server';

const BASE_URL = 'https://dummyjson.com/products/category/'

export async function GET(req, { params }) {
  const id = params?.id;
  try {
    if (!id) {
      return NextResponse.json(
        { error: 'Category is required.' },
        { status: 400 }
      );
    }

    // Fetch related products
    const response = await fetch(`${BASE_URL}${id}`);
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch related products.' },
      { status: 500 }
    );
  }
}
