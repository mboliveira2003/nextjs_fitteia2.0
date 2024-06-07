import { NextRequest, NextResponse } from 'next/server';
import { setJsonObject, getJsonObject } from '../../../utils/storage';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { datasets } = await req.json();
  setJsonObject({ datasets });

  const json = getJsonObject();

  console.log('Got the json object: ', json);
  return NextResponse.json({ message: 'Datasets updated sucessfully!', json: json}, { status: 200 });
}
