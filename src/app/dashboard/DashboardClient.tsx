"use client";

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardContent } from '@/lib/content';

interface Conversation {
  id: number;
  name: string | null;
  subject?: string;
  status?: string;
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

interface DashboardClientProps {
  content: DashboardContent;
  contactContent: {
    form: {
      fields: {
        subject: {
          options: Array<{
            value: string;
            label: string;
          }>;
        };
      };
    };
  };
}

export default function DashboardClient({ content, contactContent }: DashboardClientProps) {
  const { user, isLoaded } = useUser();
  
  const [, setConversations] = useState<Conversation[]>([]);
  const [conversationsBySubject, setConversationsBySubject] = useState<Record<string, Conversation[]>>({});
  const [loading, setLoading] = useState(true);
  
  // Obtenir tous les sujets possibles depuis le formulaire de contact
  // Utiliser contactContent passé depuis le serveur
  const allSubjects = contactContent.form.fields.subject.options
    .filter(opt => opt.value !== '') // Exclure l'option "Sélectionnez un sujet"
    .map(opt => ({ value: opt.value, label: opt.label }));

  useEffect(() => {
    if (isLoaded) {
      if (user) {
      const fetchConversations = async () => {
          // Timeout pour éviter que le chargement dure trop longtemps
          const timeoutId = setTimeout(() => {
            console.warn('Conversations fetch timeout. Stopping loading.');
            setLoading(false);
          }, 5000); // 5 secondes max

        try {
            const response = await fetch('/api/conversations', {
              // Inclure les credentials pour s'assurer que les cookies sont transmis
              credentials: 'include',
            });
            
            clearTimeout(timeoutId);
            
          if (response.ok) {
            const data = await response.json();
            // Le backend retourne un objet avec 'tickets' array, 'byCategory', et 'bySubject'
            // Ce sont uniquement les tickets de contact depuis la landing (pas la messagerie de l'app)
            const allTickets = data.tickets || [];
            const bySubject = data.bySubject || {};
            
            // Transformer les tickets pour extraire le dernier message
            const formattedTickets = allTickets.map((ticket: Conversation) => ({
              ...ticket,
              lastMessage: ticket.messages && ticket.messages.length > 0 ? {
                content: ticket.messages[0].content,
                createdAt: ticket.messages[0].createdAt,
              } : undefined,
            }));
            
            setConversations(formattedTickets);
            setConversationsBySubject(bySubject);
          } else {
              await response.json().catch(() => ({ error: 'Unknown error' }));
              
              // Gérer les différents codes d'erreur
              if (response.status === 401) {
                console.warn('Unauthorized: User may need to log in again or cookies not synced yet.');
                // Retourner un tableau vide pour afficher le message "pas de conversations"
                setConversations([]);
              } else if (response.status === 404) {
                // Pas de conversations, c'est normal
                setConversations([]);
                setConversationsBySubject({});
              } else {
                console.warn('Could not load conversations. This might be normal if you have no conversations yet.');
                setConversations([]);
                setConversationsBySubject({});
              }
          }
        } catch (error) {
            clearTimeout(timeoutId);
          console.error('Error fetching conversations:', error);
            // Erreur réseau - retourner un tableau vide
            setConversations([]);
            setConversationsBySubject({});
        } finally {
          setLoading(false);
        }
      };

        // Petit délai pour s'assurer que les cookies Clerk sont bien synchronisés après la connexion
        const timer = setTimeout(() => {
      fetchConversations();
        }, 100);

        return () => {
          clearTimeout(timer);
        };
      } else {
        // Si isLoaded mais pas de user, arrêter le loading
        setLoading(false);
      }
    }
  }, [isLoaded, user]);

  if (!isLoaded) {
    return (
      <div className="dashboard-container flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E53935] mx-auto"></div>
          <p className="mt-4 dashboard-subtitle">{content.loading}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dashboard-container flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4 dashboard-info-label">{content.mustBeLoggedIn}</p>
          <Link href="/auth/login" className="text-[#E53935] hover:text-[#C62828] font-semibold">
            {content.login}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="dashboard-container w-full">
      <div className="dashboard-inner max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="dashboard-title text-3xl sm:text-4xl font-bold mb-2">
            {content.title}
          </h1>
          <p className="dashboard-subtitle">
            {content.welcome}, {user.firstName || user.emailAddresses[0]?.emailAddress}
          </p>
        </div>

        <div className="dashboard-grid">
        {/* Conversations */}
        <div>
          <div className="dashboard-card">
            <h2 className="dashboard-card-title">
              {content.conversations.title}
            </h2>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E53935] mx-auto"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {allSubjects.map((subject) => {
                  const subjectTickets = conversationsBySubject[subject.value] || [];
                  const subjectLabel = subject.label;
                  
                  return (
                    <div key={subject.value} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-3 text-gray-800">
                        {subjectLabel}
                        {subjectTickets.length > 0 && (
                          <span className="ml-2 text-sm font-normal text-gray-500">
                            ({subjectTickets.length})
                          </span>
                        )}
                      </h3>
                      {subjectTickets.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">
                          {content.conversations.empty}
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {subjectTickets.map((conv) => {
                            // Trouver l'autre participant (pas l'utilisateur actuel)
                            const otherParticipant = conv.participants?.find(
                              (p) => p.user.id !== (user as { internalId?: number })?.internalId
                            ) || conv.participants?.[0];
                            
                            return (
                              <Link
                                key={conv.id}
                                href={`/dashboard/tickets/${conv.id}`}
                                className="dashboard-conversation-item block hover:bg-gray-50 transition-colors p-3 rounded border border-gray-100"
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h4 className="dashboard-conversation-name font-medium truncate text-sm">
                                        {conv.name || conv.subject || otherParticipant?.user.name || otherParticipant?.user.username || 'Support'}
                                      </h4>
                                      {conv.status && (
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                          conv.status === 'RESOLVED' 
                                            ? 'bg-green-100 text-green-800' 
                                            : conv.status === 'NEEDS_MAINTENANCE'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : conv.status === 'CLOSED'
                                            ? 'bg-gray-100 text-gray-800'
                                            : 'bg-blue-100 text-blue-800'
                                        }`}>
                                          {conv.status === 'RESOLVED' ? 'Résolu' : 
                                           conv.status === 'NEEDS_MAINTENANCE' ? 'Maintenance' :
                                           conv.status === 'CLOSED' ? 'Fermé' : 'Ouvert'}
                                        </span>
                                      )}
                                      {conv.isCommercial && (
                                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                                          {content.conversations.commercial}
                                        </span>
                                      )}
                                    </div>
                                    {conv.lastMessage && (
                                      <p className="dashboard-conversation-message truncate text-sm text-gray-600 mt-1">
                                        {conv.lastMessage.content}
                                      </p>
                                    )}
                                    {conv.lastMessage && (
                                      <p className="dashboard-conversation-date text-xs text-gray-400 mt-1">
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
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="dashboard-sidebar">
          <div className="dashboard-card">
            <h2 className="dashboard-card-title">
              {content.actions.title}
            </h2>
            <div className="space-y-3">
              <Link
                href="/contact"
                className="dashboard-action-button"
              >
                {content.actions.contactSupport}
              </Link>
              <Link
                href="/#download"
                className="dashboard-action-button-outline"
              >
                {content.actions.downloadApp}
              </Link>
            </div>
          </div>

          <div className="dashboard-card">
            <h2 className="dashboard-card-title">
              {content.accountInfo.title}
            </h2>
            <div className="space-y-3">
              <div>
                <span className="dashboard-info-label">{content.accountInfo.email}</span>
                <p className="dashboard-info-value">
                  {user.emailAddresses[0]?.emailAddress}
                </p>
              </div>
              {user.firstName && (
                <div>
                  <span className="dashboard-info-label">{content.accountInfo.name}</span>
                  <p className="dashboard-info-value">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
    </main>
  );
}
