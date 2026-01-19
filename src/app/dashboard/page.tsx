"use client";

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Conversation {
  id: number;
  name: string | null;
  isGroup: boolean;
  isCommercial?: boolean;
  isFavorite?: boolean;
  participants?: Array<{
    user: {
      id: number;
      name: string | null;
      username: string | null;
      profilePicture?: string;
      isVerify: boolean;
    };
  }>;
  messages?: Array<{
    id: number;
    content: string;
    createdAt: string;
    sender: {
      id: number;
      name: string | null;
    };
  }>;
  lastMessage?: {
    content: string;
    createdAt: string;
  };
  unreadCount?: number;
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      const fetchConversations = async () => {
        try {
          const response = await fetch('/api/conversations');
          if (response.ok) {
            const data = await response.json();
            // Le backend retourne un objet avec 'personal' et 'commercial' arrays
            const allConversations = [
              ...(data.personal || []),
              ...(data.commercial || []),
            ];
            // Transformer les conversations pour extraire le dernier message
            const formattedConversations = allConversations.map((conv: Conversation) => ({
              ...conv,
              lastMessage: conv.messages && conv.messages.length > 0 ? {
                content: conv.messages[0].content,
                createdAt: conv.messages[0].createdAt,
              } : undefined,
            }));
            setConversations(formattedConversations);
          } else {
            console.error('Failed to fetch conversations');
          }
        } catch (error) {
          console.error('Error fetching conversations:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchConversations();
    }
  }, [isLoaded, user]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-14rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E53935] mx-auto"></div>
          <p className="mt-4 text-secondary">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-14rem)]">
        <div className="text-center">
          <p className="text-lg mb-4">Vous devez être connecté pour accéder à cette page.</p>
          <Link href="/sign-in" className="text-[#E53935] hover:text-[#C62828] font-semibold">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-primary">
          Mon Compte
        </h1>
        <p className="text-secondary">
          Bienvenue, {user.firstName || user.emailAddresses[0]?.emailAddress}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-primary">
              Mes Conversations
            </h2>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E53935] mx-auto"></div>
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-8 text-secondary">
                <p>Aucune conversation pour le moment.</p>
                <Link 
                  href="/contact" 
                  className="mt-4 inline-block text-[#E53935] hover:text-[#C62828] font-semibold"
                >
                  Contacter le support
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {conversations.map((conv) => {
                  // Trouver l'autre participant (pas l'utilisateur actuel)
                  // Note: On compare avec l'ID interne de la DB, pas le Clerk ID
                  // Pour l'instant, on affiche juste le nom de la conversation ou le premier participant
                  const otherParticipant = conv.participants?.find(
                    (p) => p.user.id !== (user as any)?.internalId
                  ) || conv.participants?.[0];
                  const conversationName = conv.name || otherParticipant?.user.name || otherParticipant?.user.username || 'Conversation';
                  
                  return (
                    <div
                      key={conv.id}
                      className="p-4 border rounded-lg hover:bg-[#FFF5F5] transition-colors cursor-pointer border-grey"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold truncate text-primary">
                              {conversationName}
                            </h3>
                            {conv.isCommercial && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                                Commercial
                              </span>
                            )}
                            {conv.isFavorite && (
                              <svg className="w-4 h-4 text-yellow-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            )}
                          </div>
                          {conv.lastMessage && (
                            <p className="text-sm mt-1 truncate text-secondary">
                              {conv.lastMessage.content}
                            </p>
                          )}
                          {conv.lastMessage && (
                            <p className="text-xs mt-1 text-tertiary">
                              {new Date(conv.lastMessage.createdAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        {conv.unreadCount && conv.unreadCount > 0 && (
                          <span className="bg-[#E53935] text-white text-xs font-bold rounded-full px-2 py-1 ml-2 flex-shrink-0">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Actions rapides */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-primary">
              Actions Rapides
            </h2>
            <div className="space-y-3">
              <Link
                href="/contact"
                className="block w-full bg-[#E53935] hover:bg-[#C62828] text-white text-center py-3 px-4 rounded-lg font-semibold transition-colors"
              >
                Contacter le Support
              </Link>
              <Link
                href="/#download"
                className="block w-full border-2 border-[#E53935] text-[#E53935] hover:bg-[#FFF5F5] text-center py-3 px-4 rounded-lg font-semibold transition-colors"
              >
                Télécharger l'App
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-primary">
              Informations du Compte
            </h2>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-secondary">Email:</span>
                <p className="font-medium text-primary">
                  {user.emailAddresses[0]?.emailAddress}
                </p>
              </div>
              {user.firstName && (
                <div>
                  <span className="text-secondary">Nom:</span>
                  <p className="font-medium text-primary">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
