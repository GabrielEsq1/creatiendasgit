"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, MessageSquare, Building, Globe, ArrowLeft } from "lucide-react";

interface Contact {
    id: string;
    name: string;
    phone: string;
    email?: string;
    position?: string;
    industry?: string;
    website?: string;
    profilePicture?: string;
    company?: {
        name: string;
    };
}

export default function ContactsPage() {
    const router = useRouter();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        loadContacts();
    }, []);

    const loadContacts = async () => {
        try {
            const res = await fetch('/api/contacts');
            const data = await res.json();
            if (data.contacts) {
                setContacts(data.contacts);
            }
        } catch (error) {
            console.error('Error loading contacts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStartChat = async (contactId: string) => {
        try {
            const res = await fetch('/api/conversations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ participantId: contactId }),
            });

            const data = await res.json();
            if (data.conversation) {
                router.push('/chat');
            }
        } catch (error) {
            console.error('Error starting chat:', error);
        }
    };

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone.includes(searchTerm) ||
        contact.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-500">Cargando contactos...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Volver"
                        >
                            <ArrowLeft className="h-5 w-5 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Mis Contactos</h1>
                            <p className="text-sm text-gray-600">{contacts.length} contactos B2B</p>
                        </div>
                    </div>

                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Buscar por nombre, teléfono o email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none"
                    />
                </div>
            </div>

            {/* Contacts Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {filteredContacts.length === 0 ? (
                    <div className="text-center py-12">
                        <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">
                            {searchTerm ? 'No se encontraron contactos' : 'No tienes contactos aún'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredContacts.map((contact) => (
                            <div
                                key={contact.id}
                                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all"
                            >
                                {/* Avatar */}
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                                        {contact.profilePicture ? (
                                            <img src={contact.profilePicture} alt={contact.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="text-2xl font-bold text-gray-600">
                                                {contact.name.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 truncate">{contact.name}</h3>
                                        <p className="text-sm text-gray-600 truncate">{contact.position || 'Sin cargo'}</p>
                                        {contact.company && (
                                            <p className="text-xs text-gray-500 truncate flex items-center gap-1 mt-1">
                                                <Building className="h-3 w-3" />
                                                {contact.company.name}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="space-y-2 mb-4">
                                    <p className="text-sm text-gray-600 truncate">📱 {contact.phone}</p>
                                    {contact.email && (
                                        <p className="text-sm text-gray-600 truncate">✉️ {contact.email}</p>
                                    )}
                                    {contact.industry && (
                                        <p className="text-sm text-gray-600 truncate">🏢 {contact.industry}</p>
                                    )}
                                    {contact.website && (
                                        <a
                                            href={contact.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-blue-600 hover:text-blue-700 truncate flex items-center gap-1"
                                        >
                                            <Globe className="h-3 w-3" />
                                            {contact.website.replace(/^https?:\/\//, '')}
                                        </a>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleStartChat(contact.id)}
                                        className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <MessageSquare className="h-4 w-4" />
                                        Chatear
                                    </button>
                                    <button
                                        onClick={() => router.push(`/contacts/${contact.id}`)}
                                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Ver Perfil
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
