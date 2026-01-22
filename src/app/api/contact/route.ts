import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

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
    const { title, subject, message } = body;

    if (!title || !title.trim() || !subject || !message || !message.trim()) {
      return NextResponse.json(
        { error: 'Title, subject and message are required' },
        { status: 400 }
      );
    }

    // Utiliser la nouvelle route landing/contact dédiée pour les questions depuis la landing
    // Cette route est distincte des conversations de messagerie de l'app
    console.log(`[Contact API] Attempting to contact backend at: ${BACKEND_URL}/api/landing/contact`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 secondes timeout

    try {
      const backendResponse = await fetch(
        `${BACKEND_URL}/api/landing/contact`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: title.trim(),
            subject,
            message: message.trim(),
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!backendResponse.ok) {
        const error = await backendResponse.json().catch(() => ({ error: 'Backend error' }));
        console.error('[Contact API] Backend error:', backendResponse.status, error);
        
        // Messages d'erreur plus clairs selon le code de statut
        let userMessage = 'Failed to send message. Please try again later.';
        if (backendResponse.status === 400) {
          userMessage = error.error || 'Invalid request. Please check that all fields are filled correctly.';
        } else if (backendResponse.status === 401) {
          userMessage = 'Authentication failed. Please log in again.';
        } else if (backendResponse.status === 404) {
          userMessage = 'User not found. Please contact support.';
        } else if (backendResponse.status === 500) {
          userMessage = 'Server error. Please try again later or contact support.';
        }
        
        return NextResponse.json(
          { error: userMessage },
          { status: backendResponse.status }
        );
      }

      const result = await backendResponse.json();
      console.log('[Contact API] Success:', result);
      return NextResponse.json({
        success: true,
        message: 'Your message has been sent successfully to our support team. You will receive a response soon.',
        ticketId: result.ticketId,
      });
    } catch (fetchError: unknown) {
      clearTimeout(timeoutId);
      
      const err = fetchError as { name?: string; code?: string; message?: string };
      
      if (err.name === 'AbortError') {
        console.error('[Contact API] Request timeout after 15 seconds. Backend may be unreachable.');
        console.error(`[Contact API] BACKEND_URL: ${BACKEND_URL}`);
        return NextResponse.json(
          { 
            error: 'The server is taking too long to respond. Please check that the backend is running and accessible.',
            details: `Backend URL: ${BACKEND_URL}`
          },
          { status: 504 }
        );
      }
      
      if (err.code === 'ECONNREFUSED' || err.message?.includes('ECONNREFUSED')) {
        console.error('[Contact API] Connection refused. Backend is not running or not accessible.');
        console.error(`[Contact API] BACKEND_URL: ${BACKEND_URL}`);
        return NextResponse.json(
          { 
            error: 'Cannot connect to the backend server. Please ensure the backend is running.',
            details: `Backend URL: ${BACKEND_URL}`
          },
          { status: 503 }
        );
      }
      
      throw fetchError; // Re-throw pour être capturé par le catch externe
    }
  } catch (error: unknown) {
    console.error('[Contact API] Unexpected error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: (error as { message?: string }).message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}
