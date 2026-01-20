import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  try {
    // Utiliser auth() avec les headers de la requête pour s'assurer que les cookies sont bien lus
    const { userId, getToken } = await auth();
    
    if (!userId) {
      // Si pas d'userId, retourner un objet vide plutôt qu'une erreur
      // Cela permet d'éviter les erreurs visibles et le chargement infini
      // L'utilisateur verra simplement "pas de tickets"
      console.warn('[API /conversations] No userId found. Returning empty tickets.');
      return NextResponse.json({ tickets: [], byCategory: {}, categories: [] });
    }

    // Récupérer le token Clerk
    const token = await getToken();
    
    if (!token) {
      console.warn('[API /conversations] Failed to get token for userId:', userId);
      return NextResponse.json(
        { error: 'Failed to get authentication token' },
        { status: 401 }
      );
    }

    // Récupérer uniquement les tickets de contact depuis la landing
    // Cette route est distincte des conversations de messagerie de l'app
    // Le backend récupère automatiquement l'utilisateur depuis le token via authMiddleware
    const ticketsResponse = await fetch(
      `${BACKEND_URL}/api/landing/contact/tickets`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        // Ajouter un timeout pour éviter les erreurs de timeout
        signal: AbortSignal.timeout(10000), // 10 secondes
      }
    );

    if (!ticketsResponse.ok) {
      const error = await ticketsResponse.json().catch(() => ({ error: 'Backend error' }));
      console.error('Backend error fetching tickets:', error);
      // Si 404, retourner un objet vide plutôt qu'une erreur
      if (ticketsResponse.status === 404) {
        return NextResponse.json({ tickets: [], byCategory: {}, categories: [] });
      }
      return NextResponse.json(error, { status: ticketsResponse.status });
    }

    const tickets = await ticketsResponse.json();
    return NextResponse.json(tickets);
  } catch (error: any) {
    console.error('Error fetching tickets:', error);
    
    // Gérer les différents types d'erreurs
    if (error.name === 'AbortError' || error.code === 'UND_ERR_HEADERS_TIMEOUT' || error.message?.includes('timeout')) {
      console.warn('Request timeout. Backend may be slow or unreachable. Returning empty tickets.');
      return NextResponse.json({ tickets: [], byCategory: {}, categories: [] });
    }
    
    // Si c'est une erreur réseau, retourner un objet vide plutôt qu'une erreur
    if (error.message?.includes('fetch') || error.code === 'ECONNREFUSED') {
      console.warn('Backend is not reachable. Returning empty tickets.');
      return NextResponse.json({ tickets: [], byCategory: {}, categories: [] });
    }
    
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
