import Link from 'next/link';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow-sm p-6 flex justify-between items-center">
                <img src="/logo.png" alt="Creatiendas" className="h-8" />
                <div className="space-x-4">
                    <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">
                        Entrar
                    </Link>
                    <Link href="/auth/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        Crear Cuenta
                    </Link>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center text-center p-6">
                <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
                    Crea tu tienda online en minutos
                </h2>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                    La forma más rápida y sencilla de vender tus productos por WhatsApp.
                    Sin comisiones, sin complicaciones.
                </p>
                <div className="flex gap-4">
                    <Link href="/auth/register" className="bg-blue-600 text-white text-lg px-8 py-4 rounded-xl hover:bg-blue-700 transition shadow-lg">
                        🚀 Empezar Gratis
                    </Link>
                    <Link href="/auth/login" className="bg-white text-gray-700 text-lg px-8 py-4 rounded-xl hover:bg-gray-50 transition shadow border border-gray-200">
                        🔑 Entrar al Panel
                    </Link>
                </div>
            </main>

            <footer className="bg-gray-100 p-6 text-center text-gray-500">
                &copy; {new Date().getFullYear()} Creatiendas. Todos los derechos reservados.
            </footer>
        </div>
    );
}
