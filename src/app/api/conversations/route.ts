import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  try {
    const { userId, getToken } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Récupérer le token Clerk
    const token = await getToken();
    
    if (!token) {
      return NextResponse.json(
        { error: 'Failed to get authentication token' },
        { status: 401 }
      );
    }

    // D'abord, récupérer l'ID interne de l'utilisateur depuis le backend
    // Le backend utilise externalId (Clerk ID) pour trouver l'utilisateur
    const userInfoResponse = await fetch(`${BACKEND_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!userInfoResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to get user info' },
        { status: userInfoResponse.status }
      );
    }

    const userInfo = await userInfoResponse.json();
    const internalUserId = userInfo.user?.id;

    if (!internalUserId) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      );
    }

    // Récupérer les conversations avec l'ID interne
    const conversationsResponse = await fetch(
      `${BACKEND_URL}/api/messaging/conversations?userId=${internalUserId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!conversationsResponse.ok) {
      const error = await conversationsResponse.json().catch(() => ({ error: 'Backend error' }));
      return NextResponse.json(error, { status: conversationsResponse.status });
    }

    const conversations = await conversationsResponse.json();
    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
