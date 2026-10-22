import { NextRequest, NextResponse } from 'next/server';
import { saveServerUser, getServerUser } from '@/lib/serverDb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, name } = body;

    if (action === 'google') {
      const userId = 'local-demo-grower-id';
      const user = saveServerUser(userId, {
        email: email || 'grower@floragrow.local',
        accountType: 'grower',
      });
      return NextResponse.json({
        success: true,
        user: {
          uid: user.userId,
          email: user.email,
          displayName: name || 'Локальний Гровер',
        },
      });
    }

    if (action === 'login' || action === 'register') {
      if (!email) {
        return NextResponse.json({ success: false, error: 'Email обовʼязковий' }, { status: 400 });
      }

      const userId = 'user-' + String(email).replace(/[^a-zA-Z0-9]/g, '_');
      const user = saveServerUser(userId, {
        email,
        accountType: 'grower',
      });

      return NextResponse.json({
        success: true,
        user: {
          uid: user.userId,
          email: user.email,
          displayName: name || email.split('@')[0] || 'Гровер',
        },
      });
    }

    return NextResponse.json({ success: false, error: 'Невідома дія' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
