import { NextRequest, NextResponse } from 'next/server';
import { setJsonObject } from '../../../utils/storage';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { parameters } = await req.json();
  setJsonObject({ parameters });
  return NextResponse.json({ message: 'Parameters updated sucessfully!' }, { status: 200 });
}
