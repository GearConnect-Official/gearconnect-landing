import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';
const SUPPORT_USER_ID = process.env.SUPPORT_USER_ID ? parseInt(process.env.SUPPORT_USER_ID) : null;

export async function POST(request: NextRequest) {
  try {
    const { userId, getToken } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to contact support.' },
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

    const body = await request.json();
    const { subject, message } = body;

    if (!subject || !message || !message.trim()) {
      return NextResponse.json(
        { error: 'Subject and message are required' },
        { status: 400 }
      );
    }

    // Récupérer l'ID interne de l'utilisateur depuis le backend
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

    // Utiliser l'ID support depuis les variables d'environnement
    if (!SUPPORT_USER_ID) {
      return NextResponse.json(
        { error: 'Support user not configured. Please contact us via email as a last resort.' },
        { status: 500 }
      );
    }

    // Construire le message avec le sujet et le contenu
    const fullMessage = `Subject: ${subject}\n\n${message.trim()}`;

    // Créer une conversation commerciale avec le support
    const conversationResponse = await fetch(
      `${BACKEND_URL}/api/messaging/requests`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: internalUserId,
          recipientId: SUPPORT_USER_ID,
          message: fullMessage,
        }),
      }
    );

    if (!conversationResponse.ok) {
      const error = await conversationResponse.json().catch(() => ({ error: 'Backend error' }));
      return NextResponse.json(error, { status: conversationResponse.status });
    }

    const conversation = await conversationResponse.json();
    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully. You can view the conversation in your dashboard.',
      conversationId: conversation.id || conversation.conversationId,
    });
  } catch (error) {
    console.error('Error creating contact conversation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
