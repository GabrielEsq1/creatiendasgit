'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CreateStoreButton from '@/components/CreateStoreButton';

interface Store {
    id: string;
    name: string;
    slug: string;
    views: number;
    createdAt: string;
    products?: unknown[];
}

interface UserData {
    stores: Store[];
    plan: string;
    role: string;
}

export default function StoresPageEN() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/en/auth/login');
            return;
        }

        if (status === 'authenticated') {
            fetchStores();
        }
    }, [status, router]);

    const fetchStores = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/stores/my-stores', {
                cache: 'no-store',
                headers: {
                    'Cache-Control': 'no-cache',
                }
            });

            if (!response.ok) {
                throw new Error('Error loading stores');
            }

            const data = await response.json();

            // Fetch user details for plan and role
            const userResponse = await fetch('/api/user/me');
            const userInfo = await userResponse.json();

            setUserData({
                stores: data.stores || [],
                plan: userInfo.plan || 'FREE',
                role: userInfo.role || 'USER'
            });
        } catch (err) {
            console.error('Error fetching stores:', err);
            setError('Error loading stores');
        } finally {
            setLoading(false);
        }
    };

    // Auto-refresh every 5 seconds to catch changes from other tabs/devices
    useEffect(() => {
        if (status === 'authenticated') {
            const interval = setInterval(() => {
                fetchStores();
            }, 5000); // Refresh every 5 seconds

            return () => clearInterval(interval);
        }
    }, [status]);

    // Refresh when window gains focus (user switches back to this tab)
    useEffect(() => {
        const handleFocus = () => {
            if (status === 'authenticated') {
                fetchStores();
            }
        };

        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [status]);

    if (status === 'loading' || loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
                    {error}
                </div>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div>Error: Unable to load user information</div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="sm:flex sm:items-center mb-8 justify-between">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">My Stores</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Manage your created stores or create a new one.
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                        🔄 Auto-refresh every 5 seconds
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <CreateStoreButton
                        storeCount={userData.stores.length}
                        userRole={userData.role}
                        userPlan={userData.plan}
                        text="Create Store"
                    />
                </div>
            </div>

            <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                            Name
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            URL
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Status
                                        </th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {userData.stores.map((store) => (
                                        <tr key={store.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                {store.name}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                <Link href={`/stores/${store.slug}`} target="_blank" className="text-blue-600 hover:text-blue-900">
                                                    /stores/{store.slug}
                                                </Link>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                                                    Active
                                                </span>
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`/builder?edit=${store.slug}`}
                                                        className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 text-sm font-medium inline-flex items-center gap-1"
                                                    >
                                                        ✏️ Edit
                                                    </Link>
                                                    <Link
                                                        href={`/stores/${store.slug}`}
                                                        target="_blank"
                                                        className="bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 text-sm font-medium inline-flex items-center gap-1"
                                                    >
                                                        👁️ View
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {userData.stores.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="text-center py-10 text-gray-500">
                                                You don&apos;t have any stores yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Plan info badge */}
            <div className="mt-6 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div>
                    <p className="text-sm font-medium text-blue-900">
                        Current plan: <span className="font-bold">{userData.plan}</span>
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                        {userData.stores.length} of {userData.role === 'ADMIN' || userData.role === 'SUPERADMIN' ? '∞' : (userData.plan === 'PRO' ? '5' : '1')} stores used
                    </p>
                </div>
                {userData.plan === 'FREE' && (
                    <Link
                        href="/en/pricing"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                        Upgrade to PRO
                    </Link>
                )}
            </div>
        </div>
    );
}
