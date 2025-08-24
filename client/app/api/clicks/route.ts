import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const affiliate_id = searchParams.get('affiliate_id');

  const res = await fetch(`http://localhost:3001/clicks?affiliate_id=${affiliate_id}`);
  const data = await res.json();

  return NextResponse.json(data);
}
