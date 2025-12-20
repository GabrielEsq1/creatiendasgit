export const dynamic = "force-dynamic";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
            <h1 className="text-6xl font-bold text-green-500 mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-8">Página no encontrada</h2>
            <p className="text-slate-400 mb-8 text-center max-w-md">
                Lo sentimos, la página que buscas no existe o ha sido movida.
            </p>
            <a
                href="/"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition-all"
            >
                Volver al Inicio
            </a>
        </div>
    );
}
