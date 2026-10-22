import { NextRequest, NextResponse } from 'next/server';
import { getServerUserPlants, saveServerPlant, deleteServerPlant } from '@/lib/serverDb';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'local-demo-grower-id';
    const plants = getServerUserPlants(userId);
    return NextResponse.json({ success: true, plants });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, plant } = body;
    if (!userId || !plant) {
      return NextResponse.json({ success: false, error: 'userId and plant required' }, { status: 400 });
    }

    const plants = saveServerPlant(userId, plant);
    return NextResponse.json({ success: true, plants });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const plantId = searchParams.get('plantId');

    if (!userId || !plantId) {
      return NextResponse.json({ success: false, error: 'userId and plantId required' }, { status: 400 });
    }

    const plants = deleteServerPlant(userId, plantId);
    return NextResponse.json({ success: true, plants });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
