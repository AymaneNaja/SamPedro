
import { NextResponse } from 'next/server';

const BASE_URL = 'https://dummyjson.com'

export async function GET() {
  const response = await fetch(BASE_URL + '/products');
  const data = await response.json();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return NextResponse.json(data);
}
