 "use client";
import { usePathname } from 'next/navigation';

export const dynamic = "force-dynamic";

export default function NotFound() {
    const pathname = usePathname();
    const isEn = pathname?.startsWith('/en');

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
            <h1 className="text-6xl font-bold text-green-500 mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-8">
                {isEn ? 'Page Not Found' : 'P\u00e1gina no encontrada'}
            </h2>
            <p className="text-slate-400 mb-8 text-center max-w-md">
                {isEn 
                    ? "Sorry, the page you're looking for doesn't exist or has been moved." 
                    : "Lo sentimos, la p\u00e1gina que buscas no existe o ha sido movida."}
            </p>
            <a
                href={isEn ? "/en" : "/"}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition-all"
            >
                {isEn ? 'Back to Home' : 'Volver al Inicio'}
            </a>
        </div>
    );
}
