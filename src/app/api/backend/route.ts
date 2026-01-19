import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';

// URL du backend Express (à configurer dans les variables d'environnement)
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

    // Récupérer le token Clerk pour l'envoyer au backend
    const token = await getToken();
    
    if (!token) {
      return NextResponse.json(
        { error: 'Failed to get authentication token' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const endpoint = searchParams.get('endpoint') || '';
    
    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint parameter is required' },
        { status: 400 }
      );
    }

    // Construire l'URL du backend
    const backendUrl = `${BACKEND_URL}${endpoint}`;
    
    // Faire la requête au backend avec le token Clerk
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Backend error' }));
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error calling backend:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, getToken } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Récupérer le token Clerk pour l'envoyer au backend
    const token = await getToken();
    
    if (!token) {
      return NextResponse.json(
        { error: 'Failed to get authentication token' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const endpoint = searchParams.get('endpoint') || '';
    
    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint parameter is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const backendUrl = `${BACKEND_URL}${endpoint}`;
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Backend error' }));
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error calling backend:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
