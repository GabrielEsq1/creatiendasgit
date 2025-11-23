"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
    id: string;
    name: string | null;
    email: string;
    role: string;
    plan: string;
    createdAt: string;
    _count: {
        stores: number;
    };
}

interface Store {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userStores, setUserStores] = useState<Store[]>([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showStoresModal, setShowStoresModal] = useState(false);
    const [isStoresLoading, setIsStoresLoading] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
    const [tempPassword, setTempPassword] = useState('');
    const [editForm, setEditForm] = useState({ name: '', email: '', plan: '', role: '', newPassword: '' });
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            if (res.status === 403 || res.status === 401) {
                router.push('/');
                return;
            }
            if (!res.ok) throw new Error('Error fetching users');
            const data = await res.json();
            setUsers(data);
        } catch (err: any) {
            setError(`Error al cargar usuarios: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const openEditModal = (user: User) => {
        setSelectedUser(user);
        setEditForm({
            name: user.name || '',
            email: user.email,
            plan: user.plan,
            role: user.role,
            newPassword: '', // Empty by default, only set if admin wants to change it
        });
        setShowEditModal(true);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // alert('Intentando guardar...'); // Debugging
        if (!selectedUser) return;

        setIsSaving(true);
        try {
            console.log('Sending update for user:', selectedUser.id, editForm);
            const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Error updating user');
            }

            await fetchUsers();
            setShowEditModal(false);
            setSuccessMessage('✅ Usuario actualizado exitosamente');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err: any) {
            console.error('Update error:', err);
            alert(`Error: ${err.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    // ... (rest of code)

    {/* Edit User Modal */ }
    {
        showEditModal && selectedUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[2000]">
                <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
                    <h2 className="text-xl font-bold mb-4">Editar Usuario</h2>
                    <form onSubmit={handleEditSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Plan</label>
                                <select
                                    value={editForm.plan}
                                    onChange={(e) => setEditForm({ ...editForm, plan: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                                >
                                    <option value="FREE">FREE</option>
                                    <option value="PRO">PRO</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Rol</label>
                                <select
                                    value={editForm.role}
                                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                                >
                                    <option value="USER">USER</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nueva Contraseña</label>
                                <input
                                    type="password"
                                    value={editForm.newPassword}
                                    onChange={(e) => setEditForm({ ...editForm, newPassword: e.target.value })}
                                    placeholder="Dejar vacío para no cambiar"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                                />
                                <p className="mt-1 text-xs text-gray-500">Mínimo 6 caracteres. Dejar vacío si no deseas cambiar la contraseña.</p>
                            </div>
                        </div>
                        <div className="mt-6 flex gap-3">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSaving ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Guardando...
                                    </>
                                ) : 'Guardar'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowEditModal(false)}
                                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

    {/* Password Reset Modal */ }
    {
        showPasswordModal && selectedUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100]">
                <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
                    <h2 className="text-xl font-bold mb-4">Contraseña Temporal</h2>
                    <p className="text-sm text-gray-600 mb-4">
                        Nueva contraseña para <strong>{selectedUser.email}</strong>:
                    </p>
                    <div className="bg-gray-100 p-4 rounded-md mb-4">
                        <code className="text-lg font-mono">{tempPassword}</code>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => copyToClipboard(tempPassword)}
                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Copiar
                        </button>
                        <button
                            onClick={() => setShowPasswordModal(false)}
                            className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    {/* Reset Confirmation Modal */ }
    {
        showResetConfirmModal && selectedUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100]">
                <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
                    <h2 className="text-xl font-bold mb-4">¿Resetear Contraseña?</h2>
                    <p className="text-gray-600 mb-6">
                        ¿Estás seguro de que deseas resetear la contraseña para <strong>{selectedUser.email}</strong>?
                        <br />
                        Esta acción generará una contraseña temporal.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={confirmResetPassword}
                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Confirmar
                        </button>
                        <button
                            onClick={() => setShowResetConfirmModal(false)}
                            className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    {/* Stores Modal */ }
    {
        showStoresModal && selectedUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100]">
                <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                    <h2 className="text-xl font-bold mb-4">
                        Tiendas de {selectedUser.name || selectedUser.email}
                    </h2>
                    {isStoresLoading ? (
                        <div className="flex justify-center py-8">
                            <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    ) : userStores.length === 0 ? (
                        <p className="text-gray-500">No tiene tiendas creadas</p>
                    ) : (
                        <div className="space-y-3">
                            {userStores.map((store) => (
                                <div key={store.id} className="border rounded-lg p-4 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-medium">{store.name}</h3>
                                        <p className="text-sm text-gray-500">/{store.slug}</p>
                                        <p className="text-xs text-gray-400">
                                            Creada: {new Date(store.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <a
                                            href={`/stores/${store.slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 text-sm font-medium"
                                        >
                                            Ver Tienda
                                        </a>
                                        <button
                                            onClick={() => handleDeleteStore(store.id)}
                                            className="bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 text-sm font-medium"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <button
                        onClick={() => setShowStoresModal(false)}
                        className="mt-6 w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        )
    }
        </div >
    );
}
