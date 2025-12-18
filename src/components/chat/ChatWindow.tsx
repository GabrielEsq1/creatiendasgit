"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Paperclip, Send, MoreVertical, Search, Smile } from "lucide-react";
// import { useSocket } from "@/hooks/useSocket";

interface Message {
  id: string;
  content: string;
  senderId: string;
  conversationId: string;
  createdAt: Date;
  read: boolean;
}

interface ChatWindowProps {
  conversation?: any;
}

export default function ChatWindow({ conversation }: ChatWindowProps) {
  const { data: session } = useSession();
  // const { socket } = useSocket();
  const socket = null as any; // Emergency: socket disabled
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversation) {
      loadMessages();
    }
  }, [conversation]);

  useEffect(() => {
    if (!socket || !conversation) return;

    socket.emit("join-conversation", conversation.id);

    const handleNewMessage = (newMessage: Message) => {
      setMessages((prev) => [...prev, newMessage]);
    };

    socket.on("new-message", handleNewMessage);

    return () => {
      socket.emit("leave-conversation", conversation.id);
      socket.off("new-message", handleNewMessage);
    };
  }, [socket, conversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMessages = async () => {
    if (!conversation) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/conversations/${conversation.id}/messages`);
      const data = await res.json();

      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || sending || !conversation) return;

    const messageContent = message.trim();
    setMessage("");
    setSending(true);

    try {
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: conversation.id,
          text: messageContent, // Changed from content to text to match API
        }),
      });

      const data = await res.json();

      if (data.message) {
        // Optimistic update is handled by socket, but we can keep this for fallback
        // or if socket is disconnected.
        // However, to avoid duplicates if socket is fast, we might want to check IDs.
        // For simplicity, we rely on socket for real-time update.
        // But if we want instant feedback before server confirms, we can add optimistically.

        // Let's emit the message via socket here as well if we want to bypass API for speed?
        // No, standard pattern is: API saves to DB -> API/Client emits socket event.
        // Our API doesn't emit socket event yet. We should update the API to emit it, 
        // OR emit it from client after successful save.
        // The current plan said "Emit send-message event after successful API call".

        if (socket) {
          socket.emit("send-message", {
            conversationId: conversation.id,
            message: data.message
          });
        } else {
          // Fallback if no socket
          setMessages((prev) => [...prev, data.message]);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessage(messageContent); // Restore message on error
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!conversation) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
            <span className="text-3xl font-bold text-blue-600">B2B</span>
          </div>
          <h2 className="text-2xl font-light text-gray-600">B2BChat</h2>
          <p className="mt-4 max-w-md text-sm text-gray-500">
            Selecciona una conversación para comenzar a chatear
            <br />o inicia un nuevo chat con el botón +
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-[#efeae2]">
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-50 px-4 py-2 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="font-semibold text-blue-600">
              {conversation.otherUser?.name?.charAt(0).toUpperCase() || '?'}
            </span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              {conversation.otherUser?.name || 'Usuario'}
            </h3>
            <p className="text-xs text-gray-500">
              {conversation.otherUser?.phone || ''}
            </p>
          </div>
        </div>
        <div className="flex gap-2 text-gray-500 relative">
          <button className="hover:bg-gray-200 p-2 rounded-full">
            <Search className="h-5 w-5" />
          </button>
          <div className="relative group">
            <button className="hover:bg-gray-200 p-2 rounded-full">
              <MoreVertical className="h-5 w-5" />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block hover:block">
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  // Placeholder for view profile
                  alert('Ver perfil');
                }}
              >
                Ver perfil
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                onClick={async () => {
                  if (confirm('¿Estás seguro de eliminar esta conversación?')) {
                    try {
                      const res = await fetch(`/api/conversations/${conversation.id}`, {
                        method: 'DELETE'
                      });
                      if (res.ok) {
                        window.location.reload();
                      } else {
                        alert('Error al eliminar');
                      }
                    } catch (e) {
                      console.error(e);
                    }
                  }
                }}
              >
                Eliminar chat
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  alert('Usuario bloqueado (Simulado)');
                }}
              >
                Bloquear usuario
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Cargando mensajes...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No hay mensajes. ¡Envía el primero!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === session?.user?.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[60%] rounded-lg px-3 py-2 shadow-sm ${isMe
                    ? "bg-[#d9fdd3] rounded-tr-none"
                    : "bg-white rounded-tl-none"
                    }`}
                >
                  <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">
                    {msg.content || (msg as any).text}
                  </p>
                  <div className={`mt-1 flex items-center gap-1 ${isMe ? "justify-end" : "justify-start"}`}>
                    <span className="text-[10px] text-gray-500">
                      {new Date(msg.createdAt).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {isMe && (
                      <span className="text-blue-500 text-xs">
                        {msg.read ? "✓✓" : "✓"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <button className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-200 rounded-full">
            <Smile className="h-6 w-6" />
          </button>
          <button className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-200 rounded-full">
            <Paperclip className="h-6 w-6" />
          </button>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Escribe un mensaje"
              className="w-full rounded-lg border-none bg-white py-2 px-4 text-sm focus:ring-1 focus:ring-gray-300"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={sending}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!message.trim() || sending}
            className="text-blue-600 hover:text-blue-700 p-2 hover:bg-gray-200 rounded-full disabled:text-gray-300 disabled:cursor-not-allowed"
          >
            <Send className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
