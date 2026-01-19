import { NextRequest, NextResponse } from 'next/server';
import { auth, getToken } from '@clerk/nextjs/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { email, username } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
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

    // Synchroniser avec le backend Express
    // Le backend va créer l'utilisateur dans la DB s'il n'existe pas
    const response = await fetch(`${BACKEND_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        email,
        username: username || email.split('@')[0],
        password: '', // Le mot de passe est géré par Clerk
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Backend error' }));
      // Si l'utilisateur existe déjà, ce n'est pas une erreur critique
      if (response.status === 400 && error.error?.includes('déjà utilisé')) {
        return NextResponse.json({ 
          success: true, 
          message: 'User already exists in backend' 
        });
      }
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error syncing with backend:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
