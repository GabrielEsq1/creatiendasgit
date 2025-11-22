import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return (
            <div className="text-center mt-20">
                <p>No tienes sesión. Redirigiendo a login...</p>
                <script dangerouslySetInnerHTML={{ __html: `setTimeout(()=>{window.location.href='/auth/login'},1500);` }} />
            </div>
        );
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { stores: true, stripeCustomer: true },
    });

    const plan = user?.stripeCustomer ? 'Plan activo (consulta Stripe)' : 'Plan gratuito';

    return (
        <section className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
            <h1 className="text-3xl font-bold mb-6">Panel de Creatiendas</h1>

            <section className="mb-8">
                <h2 className="text-xl font-semibold">Datos de la cuenta</h2>
                <p><strong>Correo:</strong> {user?.email}</p>
                <p><strong>Nombre:</strong> {user?.name ?? 'No especificado'}</p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold">Tus tiendas</h2>
                {user?.stores?.length ? (
                    <ul className="list-disc pl-5">
                        {user.stores.map((store) => (
                            <li key={store.id}>
                                <Link href={`/stores/C:\Users\ASUS\Desktop\creatiendas\creatiendasgit{store.slug}`} className="text-indigo-600 hover:underline">{store.name}</Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No tienes tiendas creadas.</p>
                )}
                <Link href="/builder" className="inline-block mt-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Crear nueva tienda</Link>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold">Plan de suscripción</h2>
                <p>{plan}</p>
                <form action="/api/stripe/portal" method="POST" className="mt-2">
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Gestionar suscripción</button>
                </form>
                <form action="/api/stripe/checkout" method="POST" className="mt-4">
                    <input type="hidden" name="priceId" value="price_XXXXXXXXXXXX" />
                    <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Cambiar a plan Pro</button>
                </form>
            </section>
        </section>
    );
}
