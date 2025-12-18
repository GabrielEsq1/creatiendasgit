"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Search, Plus, MessageSquare, User, MoreVertical, X, ArrowLeft, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import InvitationModal from "./InvitationModal";
import CreateGroupModal from "./CreateGroupModal";
import GlobalCompanySearch from "./GlobalCompanySearch";

interface Conversation {
    id: string;
    participants: any[];
    lastMessage?: string;
    lastMessageAt?: Date;
    unreadCount?: number;
    otherUser?: {
        id: string;
        name: string;
        phone: string;
    };
}

interface ChatSidebarProps {
    onSelectConversation: (conversation: Conversation) => void;
    selectedId?: string;
}

export default function ChatSidebar({ onSelectConversation, selectedId }: ChatSidebarProps) {
    const router = useRouter();
    const { data: session } = useSession();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showNewChat, setShowNewChat] = useState(false);
    const [showNewGroup, setShowNewGroup] = useState(false);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [showStarredMessages, setShowStarredMessages] = useState(false);
    const [showProfileEdit, setShowProfileEdit] = useState(false);
    const [searchPhone, setSearchPhone] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [showOptionsMenu, setShowOptionsMenu] = useState(false);
    const [selectedChats, setSelectedChats] = useState<string[]>([]);
    const [showInvitationModal, setShowInvitationModal] = useState(false);
    const [invitedPhone, setInvitedPhone] = useState("");
    const [showGlobalSearch, setShowGlobalSearch] = useState(false);
    const [contacts, setContacts] = useState<any[]>([]);
    const menuRef = useRef<HTMLDivElement>(null);

    // Profile edit state
    const [editName, setEditName] = useState(session?.user?.name || "");
    const [savingProfile, setSavingProfile] = useState(false);

    useEffect(() => {
        loadConversations();
        loadContacts();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowOptionsMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const loadConversations = async () => {
        try {
            const res = await fetch('/api/conversations');
            const data = await res.json();

            if (data.conversations) {
                const processedConversations = data.conversations.map((conv: any) => {
                    const otherParticipant = conv.participants.find(
                        (p: any) => p.userId !== session?.user?.id
                    );
                    return {
                        ...conv,
                        otherUser: otherParticipant?.user || null,
                    };
                });
                setConversations(processedConversations);
            }
        } catch (error) {
            console.error('Error loading conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadContacts = async () => {
        try {
            const res = await fetch('/api/contacts');
            const data = await res.json();
            if (data.contacts) {
                setContacts(data.contacts);
            }
        } catch (error) {
            console.error('Error loading contacts:', error);
        }
    };

    const handleSearchContact = async () => {
        if (!searchPhone.trim()) return;

        try {
            const res = await fetch(`/api/contacts/search?phone=${encodeURIComponent(searchPhone)}`);
            const data = await res.json();

            if (data.invited) {
                // Contact not found, show invitation modal
                setInvitedPhone(searchPhone);
                setShowInvitationModal(true);
                setSearchPhone("");
                setShowNewChat(false);
            } else if (data.user) {
                // Contact found
                setSearchResults([data.user]);
            } else if (data.error) {
                alert(data.error);
            }
        } catch (error) {
            console.error('Error searching contact:', error);
            alert('Error al buscar contacto');
        }
    };

    const handleStartChat = async (userId: string) => {
        try {
            const res = await fetch('/api/conversations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ participantId: userId }),
            });

            const data = await res.json();

            if (data.conversation) {
                setShowNewChat(false);
                setSearchPhone("");
                setSearchResults([]);
                loadConversations();
                onSelectConversation(data.conversation);
            }
        } catch (error) {
            console.error('Error creating conversation:', error);
        }
    };

    const handleCreateGroup = async (name: string, description: string, memberIds: string[]) => {
        try {
            const res = await fetch('/api/groups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description, memberIds }),
            });

            const data = await res.json();

            if (data.group) {
                alert(`✅ Grupo "${name}" creado exitosamente`);
                loadConversations();
            }
        } catch (error) {
            console.error('Error creating group:', error);
            throw error;
        }
    };

    const filteredConversations = conversations.filter(conv =>
        conv.otherUser?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.otherUser?.phone?.includes(searchTerm)
    );

    return (
        <div className="flex h-full w-80 flex-col border-r border-gray-200 bg-white">
            {/* Header */}
            <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="rounded-full p-2 hover:bg-gray-200 text-gray-600"
                        title="Volver al dashboard"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => setShowProfileEdit(true)}
                        className="flex items-center gap-2 hover:bg-gray-100 rounded-lg p-1 transition-colors"
                        title="Editar perfil"
                    >
                        <div className="h-10 w-10 overflow-hidden rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-bold text-blue-600">
                                {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                        </div>
                        <span className="font-medium text-gray-700">{session?.user?.name}</span>
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowGlobalSearch(true)}
                        className="rounded-full p-2 hover:bg-gray-200 text-green-600"
                        title="Buscar empresas globalmente"
                        aria-label="Buscar empresas"
                    >
                        <Globe className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => setShowNewChat(!showNewChat)}
                        className="rounded-full p-2 hover:bg-gray-200 text-blue-600"
                        aria-label="Nuevo chat"
                    >
                        <Plus className="h-5 w-5" />
                    </button>
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                            className="rounded-full p-2 hover:bg-gray-200 text-gray-600"
                            aria-label="Opciones"
                        >
                            <MoreVertical className="h-5 w-5" />
                        </button>

                        {/* Dropdown Menu */}
                        {showOptionsMenu && (
                            <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white shadow-xl border border-gray-200 z-[9999]">
                                <div className="py-1">
                                    <button
                                        onClick={() => {
                                            setShowNewGroup(true);
                                            setShowOptionsMenu(false);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Nuevo grupo
                                    </button>
                                    <button
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => {
                                            setShowStarredMessages(true);
                                            setShowOptionsMenu(false);
                                        }}
                                    >
                                        Mensajes destacados
                                    </button>
                                    <button
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => {
                                            setIsSelectionMode(!isSelectionMode);
                                            setSelectedChats([]);
                                            setShowOptionsMenu(false);
                                        }}
                                    >
                                        {isSelectionMode ? "Cancelar selección" : "Seleccionar chats"}
                                    </button>
                                    <div className="border-t border-gray-200 my-1"></div>
                                    <button
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => {
                                            setShowOptionsMenu(false);
                                            window.location.href = '/dashboard/profile';
                                        }}
                                    >
                                        Configuración
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowOptionsMenu(false);
                                            window.location.href = '/api/auth/signout';
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                                    >
                                        Cerrar sesión
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Profile Edit Modal */}
            {showProfileEdit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Editar Perfil</h3>
                            <button onClick={() => setShowProfileEdit(false)} className="text-gray-500 hover:text-gray-700" title="Cerrar">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">Nombre</label>
                                <input
                                    id="edit-name"
                                    type="text"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    placeholder="Tu nombre"
                                />
                            </div>
                            <div>
                                <label htmlFor="edit-phone" className="block text-sm font-medium text-gray-700">Teléfono</label>
                                <input
                                    id="edit-phone"
                                    type="tel"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100"
                                    value={(session?.user as any)?.phone || ''}
                                    disabled
                                    title="El teléfono no se puede cambiar"
                                />
                                <p className="mt-1 text-xs text-gray-500">El teléfono no se puede cambiar</p>
                            </div>
                        </div>
                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={() => setShowProfileEdit(false)}
                                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={async () => {
                                    setSavingProfile(true);
                                    try {
                                        const res = await fetch('/api/user/profile', {
                                            method: 'PATCH',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ name: editName })
                                        });
                                        if (res.ok) {
                                            alert('Perfil actualizado');
                                            setShowProfileEdit(false);
                                            window.location.reload();
                                        }
                                    } catch (error) {
                                        alert('Error al actualizar perfil');
                                    } finally {
                                        setSavingProfile(false);
                                    }
                                }}
                                disabled={savingProfile}
                                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-gray-400"
                            >
                                {savingProfile ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Starred Messages Modal */}
            {showStarredMessages && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Mensajes Destacados</h3>
                            <button
                                onClick={() => setShowStarredMessages(false)}
                                className="text-gray-500 hover:text-gray-700"
                                title="Cerrar"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="text-center py-8 text-gray-500">
                            <p>No tienes mensajes destacados</p>
                            <p className="text-sm mt-2">Mantén presionado un mensaje y selecciona la estrella para destacarlo</p>
                        </div>
                    </div>
                </div>
            )}

            {/* New Group Modal */}
            {showNewGroup && (
                <CreateGroupModal
                    onClose={() => setShowNewGroup(false)}
                    onCreateGroup={handleCreateGroup}
                />
            )}

            {/* New Chat Modal */}
            {showNewChat && (
                <div className="border-b border-gray-200 bg-blue-50 p-4">
                    <h3 className="mb-2 font-medium text-gray-900">Nuevo Chat</h3>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="+57 300 123 4567"
                            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            value={searchPhone}
                            onChange={(e) => setSearchPhone(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearchContact()}
                        />
                        <button
                            onClick={handleSearchContact}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                        >
                            Buscar
                        </button>
                    </div>

                    {searchResults.length > 0 && (
                        <div className="mt-2 space-y-2">
                            {searchResults.map((user) => (
                                <button
                                    key={user.id}
                                    onClick={() => handleStartChat(user.id)}
                                    className="w-full flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 text-left hover:bg-gray-50"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                                        <User className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{user.name}</p>
                                        <p className="text-sm text-gray-500">{user.phone}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Contacts List in New Chat */}
            {showNewChat && searchResults.length === 0 && (
                <div className="flex-1 overflow-y-auto bg-gray-50 p-2">
                    <h4 className="mb-2 px-2 text-xs font-semibold text-gray-500 uppercase">Tus Contactos</h4>
                    {contacts.length === 0 ? (
                        <p className="px-2 text-sm text-gray-500">No tienes contactos aún.</p>
                    ) : (
                        <div className="space-y-1">
                            {contacts.map((contact) => (
                                <button
                                    key={contact.id}
                                    onClick={() => handleStartChat(contact.id)}
                                    className="w-full flex items-center gap-3 rounded-lg border border-transparent p-2 text-left hover:bg-white hover:shadow-sm transition-all"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-xs">
                                        {contact.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="font-medium text-gray-900 text-sm truncate">{contact.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{contact.company?.name}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Search */}
            <div className="p-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar conversaciones"
                        className="w-full rounded-lg border-none bg-gray-100 py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Selection Mode Banner */}
            {
                isSelectionMode && (
                    <div className="bg-blue-100 px-4 py-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-900">
                            {selectedChats.length} seleccionado{selectedChats.length !== 1 ? 's' : ''}
                        </span>
                        <button
                            onClick={() => {
                                setIsSelectionMode(false);
                                setSelectedChats([]);
                            }}
                            className="text-sm text-blue-600 hover:text-blue-700"
                        >
                            Cancelar
                        </button>
                    </div>
                )
            }

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="p-4 text-center text-gray-500">Cargando...</div>
                ) : filteredConversations.length === 0 ? (
                    <div className="p-8 text-center">
                        <MessageSquare className="mx-auto h-12 w-12 text-gray-300" />
                        <p className="mt-2 text-sm text-gray-500">
                            {searchTerm ? 'No se encontraron conversaciones' : 'No hay conversaciones'}
                        </p>
                        <button
                            onClick={() => setShowNewChat(true)}
                            className="mt-4 text-sm text-blue-600 hover:text-blue-700"
                        >
                            Iniciar nuevo chat
                        </button>
                    </div>
                ) : (
                    filteredConversations.map((conv) => (
                        <div
                            key={conv.id}
                            onClick={() => {
                                if (isSelectionMode) {
                                    setSelectedChats(prev =>
                                        prev.includes(conv.id)
                                            ? prev.filter(id => id !== conv.id)
                                            : [...prev, conv.id]
                                    );
                                } else {
                                    onSelectConversation(conv);
                                }
                            }}
                            className={`cursor-pointer border-b border-gray-100 px-4 py-3 hover:bg-gray-50 ${selectedId === conv.id ? "bg-blue-50" : ""
                                } ${selectedChats.includes(conv.id) ? "bg-blue-100" : ""
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    {isSelectionMode && (
                                        <input
                                            type="checkbox"
                                            checked={selectedChats.includes(conv.id)}
                                            onChange={() => { }}
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            title="Seleccionar chat"
                                        />
                                    )}
                                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                        <span className="text-lg font-semibold text-blue-600">
                                            {conv.otherUser?.name?.charAt(0).toUpperCase() || '?'}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-gray-900 truncate">
                                            {conv.otherUser?.name || 'Usuario'}
                                        </h3>
                                        <p className="text-sm text-gray-500 truncate">
                                            {conv.lastMessage || 'Sin mensajes'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                    {conv.lastMessageAt && (
                                        <span className="text-xs text-gray-400">
                                            {new Date(conv.lastMessageAt).toLocaleTimeString('es-ES', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    )}
                                    {conv.unreadCount && conv.unreadCount > 0 && (
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                                            {conv.unreadCount}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Invitation Modal */}
            {
                showInvitationModal && (
                    <InvitationModal
                        phone={invitedPhone}
                        onClose={() => setShowInvitationModal(false)}
                    />
                )
            }

            {/* Global Company Search Modal */}
            {
                showGlobalSearch && (
                    <GlobalCompanySearch
                        onClose={() => setShowGlobalSearch(false)}
                        onStartChat={handleStartChat}
                    />
                )
            }
        </div >
    );
}
