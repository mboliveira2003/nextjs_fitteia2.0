import { NextRequest, NextResponse } from 'next/server';
import { getJsonObject, clearJsonObject } from '../../../utils/storage';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const jsonObject = getJsonObject();

    const form = new FormData();
    const jsonBlob = new Blob([JSON.stringify(jsonObject)], { type: 'application/json' });

    form.append('download', 'json');
    form.append('username', 'mboliveira');
    form.append('file', jsonBlob, 'data.json');

    const response = await fetch('http://onefite-t.vps.tecnico.ulisboa.pt:8142/fit', {
      method: 'POST',
      body: form as any,  // Type assertion needed here due to FormData type incompatibility
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const jsonResponse = await response.json();
    clearJsonObject();  // Clear the stored JSON object after successful submission
    return NextResponse.json(jsonResponse, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send request' }, { status: 500 });
  }
}

