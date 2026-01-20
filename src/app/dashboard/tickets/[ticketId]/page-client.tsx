"use client";

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardContent } from '@/lib/content';
import '@/styles/components/dashboard.css';

interface Message {
  id: number;
  content: string;
  createdAt: string;
  senderId?: number;
  sender: {
    id: number;
    name: string | null;
    username: string | null;
    profilePicture?: string;
    profilePicturePublicId?: string;
  };
}

interface TicketPageClientProps {
  content: DashboardContent;
}

export default function TicketPageClient({ content }: TicketPageClientProps) {
  const { user, isLoaded } = useUser();
  const params = useParams();
  const router = useRouter();
  const ticketId = Array.isArray(params.ticketId) ? params.ticketId[0] : params.ticketId as string;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState<string>('OPEN');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    if (isLoaded && user && ticketId) {
      fetchMessages();
    }
  }, [isLoaded, user, ticketId]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tickets/${ticketId}/messages`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        const messagesList = data.messages || [];
        setMessages(messagesList);
        
        // Déterminer l'ID interne de l'utilisateur actuel
        // L'utilisateur est celui qui n'est pas l'admin
        // On peut le déterminer en cherchant un message qui n'est pas de l'admin
        if (messagesList.length > 0 && !currentUserId) {
          // Chercher le premier message qui n'est pas de l'admin
          // L'admin a généralement un nom "Admin" ou un ID spécifique
          const userMessage = messagesList.find((msg: Message) => {
            const senderName = msg.sender?.name?.toLowerCase() || ''
            return senderName !== 'admin' && !senderName.includes('admin')
          })
          if (userMessage) {
            setCurrentUserId(userMessage.sender?.id || userMessage.senderId || null)
          }
        }
        
        if (data.status) {
          setStatus(data.status);
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: content.ticket?.errors.loadMessages || 'Failed to load messages' }));
        setError(errorData.error || content.ticket?.errors.loadMessages || 'Failed to load messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError(content.ticket?.errors.loadMessages || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) {
      return;
    }

    try {
      setSending(true);
      setError('');

      const response = await fetch(`/api/tickets/${ticketId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ message: newMessage.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        const newMsg = data.message;
        
        // Déterminer l'ID de l'utilisateur si ce n'est pas déjà fait
        if (!currentUserId && newMsg.sender?.id) {
          const senderName = newMsg.sender?.name?.toLowerCase() || ''
          if (senderName !== 'admin' && !senderName.includes('admin')) {
            setCurrentUserId(newMsg.sender.id)
          }
        }
        
        // Ajouter le nouveau message à la liste
        setMessages([...messages, newMsg]);
        setNewMessage('');
      } else {
        const errorData = await response.json().catch(() => ({ error: content.ticket?.errors.sendMessage || 'Failed to send message' }));
        setError(errorData.error || content.ticket?.errors.sendMessage || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError(content.ticket?.errors.sendMessage || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleMarkAsResolved = async () => {
    if (status === 'RESOLVED' || updatingStatus) {
      return;
    }

    if (!confirm(content.ticket?.confirmResolved || 'Marquer ce ticket comme résolu ?')) {
      return;
    }

    try {
      setUpdatingStatus(true);
      setError('');

      const response = await fetch(`/api/tickets/${ticketId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: 'RESOLVED' }),
      });

      if (response.ok) {
        setStatus('RESOLVED');
      } else {
        const errorData = await response.json().catch(() => ({ error: content.ticket?.errors.updateStatus || 'Failed to update status' }));
        setError(errorData.error || content.ticket?.errors.updateStatus || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setError(content.ticket?.errors.updateStatus || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="dashboard-container flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E53935] mx-auto"></div>
          <p className="mt-4 dashboard-subtitle">{content.ticket?.loading || content.loading}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dashboard-container flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg mb-4 dashboard-info-label">{content.ticket?.mustBeLoggedIn || content.mustBeLoggedIn}</p>
          <Link href="/auth/login" className="text-[#E53935] hover:text-[#C62828] font-semibold">
            {content.ticket?.login || content.login}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="dashboard-container w-full">
      <div className="dashboard-inner max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
        <Link 
          href="/dashboard" 
          className="text-[#E53935] hover:text-[#C62828] font-semibold mb-4 inline-block"
        >
          ← {content.ticket?.back || 'Retour aux conversations'}
        </Link>
        <div className="flex justify-between items-center mb-2">
          <h1 className="dashboard-title text-3xl sm:text-4xl font-bold">
            {content.ticket?.title || 'Conversation'}
          </h1>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              status === 'RESOLVED' 
                ? 'bg-green-100 text-green-800' 
                : status === 'NEEDS_MAINTENANCE'
                ? 'bg-yellow-100 text-yellow-800'
                : status === 'CLOSED'
                ? 'bg-gray-100 text-gray-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {status === 'RESOLVED' ? (content.ticket?.status.resolved || 'Résolu') : 
               status === 'NEEDS_MAINTENANCE' ? (content.ticket?.status.needsMaintenance || 'Maintenance requise') :
               status === 'CLOSED' ? (content.ticket?.status.closed || 'Fermé') : (content.ticket?.status.open || 'Ouvert')}
            </span>
            {status !== 'RESOLVED' && (
              <button
                onClick={handleMarkAsResolved}
                disabled={updatingStatus}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updatingStatus ? (content.ticket?.sending || 'Mise à jour...') : (content.ticket?.markAsResolved || 'Marquer comme résolu')}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E53935] mx-auto"></div>
            <p className="mt-4 dashboard-subtitle">{content.ticket?.loading || content.loading}</p>
          </div>
        ) : error && messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchMessages}
              className="text-[#E53935] hover:text-[#C62828] font-semibold"
            >
              Réessayer
            </button>
          </div>
        ) : (
          <>
            {/* Messages */}
            <div className="space-y-0 mb-6 max-h-[500px] overflow-y-auto px-4 py-4">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="dashboard-info-label">{content.ticket?.noMessages || 'Aucun message dans cette conversation'}</p>
                </div>
              ) : (
                messages.map((message, index) => {
                  const messageSenderId = message.sender?.id || message.senderId
                  const isOwnMessage = currentUserId ? messageSenderId === currentUserId : false
                  
                  const previousMessage = index > 0 ? messages[index - 1] : null
                  const nextMessage = index < messages.length - 1 ? messages[index + 1] : null
                  
                  // Show avatar only on the last message of a consecutive series
                  const previousMessageSenderId = previousMessage ? (previousMessage.sender?.id || previousMessage.senderId) : null
                  const nextMessageSenderId = nextMessage ? (nextMessage.sender?.id || nextMessage.senderId) : null
                  const showAvatar = !nextMessage || 
                                    nextMessageSenderId !== messageSenderId ||
                                    (nextMessage && (new Date(nextMessage.createdAt).getTime() - new Date(message.createdAt).getTime()) > 300000)
                  
                  // Group messages: same user, less than 5 minutes apart
                  const isGrouped = previousMessageSenderId === messageSenderId &&
                                   previousMessage?.createdAt &&
                                   (new Date(message.createdAt).getTime() - new Date(previousMessage?.createdAt || 0).getTime()) < 300000
                  
                  const isNewGroup = !isGrouped
                  
                  // Get sender info
                  // Détecter si c'est l'admin : si ce n'est pas un message de l'utilisateur actuel, c'est l'admin
                  const isAdmin = !isOwnMessage
                  
                  // Pour l'admin, toujours utiliser "GearConnect Support" et le logo
                  // Pour les autres utilisateurs, utiliser les informations du message
                  let sender
                  if (isAdmin) {
                    sender = { name: content.support?.name || 'GearConnect Support', profilePicture: '/logo.png', profilePicturePublicId: null }
                  } else {
                    sender = message.sender || { name: content.support?.unknownUser || 'Unknown', profilePicture: null, profilePicturePublicId: null }
                  }
                  
                  return (
                    <div
                      key={message.id}
                      className={`ticket-message-container ${isOwnMessage ? 'own-message' : 'other-message'} ${isNewGroup ? 'new-group' : ''}`}
                    >
                      {/* Avatar for other users' messages (left side) */}
                      {!isOwnMessage && (
                        showAvatar ? (
                          <div className="ticket-message-avatar-container">
                            {isAdmin ? (
                              <img
                                src="/logo.png"
                                alt="Admin"
                                className="ticket-message-avatar"
                              />
                            ) : sender.profilePicturePublicId ? (
                              <img
                                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_100,h_100,c_fill,g_face/${sender.profilePicturePublicId}`}
                                alt={sender.name || 'User'}
                                className="ticket-message-avatar"
                              />
                            ) : sender.profilePicture ? (
                              <img
                                src={sender.profilePicture}
                                alt={sender.name || 'User'}
                                className="ticket-message-avatar"
                              />
                            ) : (
                              <div className="ticket-message-avatar-placeholder">
                                {(sender.name || 'U').charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="ticket-message-avatar-spacer"></div>
                        )
                      )}
                      
                      {/* Message bubble */}
                      <div className={`ticket-message-bubble-wrapper ${isGrouped ? 'grouped' : ''}`}>
                        <div
                          className={`ticket-message-bubble ${isOwnMessage ? 'own' : 'other'} ${isGrouped ? 'grouped' : ''}`}
                        >
                          {/* Sender name */}
                          {isNewGroup && (
                            <div className={`ticket-message-sender-name ${isOwnMessage ? 'own' : 'other'}`}>
                              {sender.name || content.support?.unknownUser || 'Unknown User'}
                            </div>
                          )}
                          
                          {/* Message text */}
                          <div className={`ticket-message-text ${isOwnMessage ? 'own' : 'other'}`}>
                            {message.content}
                          </div>
                          
                          {/* Message time */}
                          <div className={`ticket-message-time ${isOwnMessage ? 'own' : 'other'}`}>
                            {new Date(message.createdAt).toLocaleString('fr-FR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            <div className="mt-6">
              <div className="flex gap-2">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={content.ticket?.sendMessage || 'Tapez votre message...'}
                  className="ticket-message-input flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#E53935] focus:border-transparent resize-none"
                  rows={3}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sending}
                  className="bg-[#E53935] hover:bg-[#C62828] text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (content.ticket?.sending || 'Envoi...') : (content.ticket?.sendMessage || 'Envoyer')}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      </div>
    </main>
  );
}
