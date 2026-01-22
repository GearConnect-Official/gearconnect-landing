import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

/**
 * Route temporaire pour obtenir le token Clerk
 * ⚠️ À supprimer après les tests pour des raisons de sécurité
 */
export async function GET() {
  try {
    const { userId, getToken } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { 
          error: 'Not authenticated',
          message: 'Please log in first to get your token'
        },
        { status: 401 }
      );
    }
    
    const token = await getToken();
    
    if (!token) {
      return NextResponse.json(
        { 
          error: 'Token not available',
          message: 'Could not retrieve token from Clerk session'
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      token,
      userId,
      message: 'Copy the token value and use it in your tests'
    });
  } catch (error: unknown) {
    console.error('[Get Token API] Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: (error as { message?: string }).message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}
