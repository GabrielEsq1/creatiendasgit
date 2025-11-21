import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function BillingPage() {
    const session = await auth();

    if (!session?.user?.email) {
        redirect('/auth/login');
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Mi Plan y Facturación</h1>

            <div className="bg-white shadow sm:rounded-lg p-6">
                <div className="text-center py-10">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                        <i className="fas fa-credit-card text-blue-600"></i>
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Gestión de Suscripción</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Próximamente podrás gestionar tu plan y métodos de pago aquí.
                    </p>
                    <div className="mt-6">
                        <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Ver Planes Disponibles
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
