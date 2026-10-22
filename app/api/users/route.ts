import { NextRequest, NextResponse } from 'next/server';
import { getServerUser, getAllServerUsers, saveServerUser, saveServerUserData, getServerUserData } from '@/lib/serverDb';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    const userId = searchParams.get('userId');

    if (action === 'all') {
      const users = getAllServerUsers();
      return NextResponse.json({ success: true, users });
    }

    if (!userId) {
      return NextResponse.json({ success: false, error: 'userId parameter required' }, { status: 400 });
    }

    const userData = getServerUserData(userId);
    return NextResponse.json({ success: true, userData });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, data } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: 'userId required' }, { status: 400 });
    }

    saveServerUserData(userId, data || {});
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, accountType, isSeller } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: 'userId required' }, { status: 400 });
    }

    const updated = saveServerUser(userId, { accountType, isSeller });
    return NextResponse.json({ success: true, user: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
