import { NextRequest, NextResponse } from 'next/server';
import { setJsonObject } from '../../../utils/storage';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { functions } = await req.json();
  setJsonObject({ functions });
  return NextResponse.json({ message: 'Functions updated sucessfully!' }, { status: 200 });
}
