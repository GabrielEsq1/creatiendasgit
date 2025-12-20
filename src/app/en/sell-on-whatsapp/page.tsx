import React from 'react';
import ArticleLayoutEN from '@/components/en/ArticleLayoutEN';

export default function SellOnWhatsAppPageEN() {
    return (
        <ArticleLayoutEN
            title="How to sell on WhatsApp with an online store (practical guide)"
            heroImage="/images/blog/vender-por-whatsapp.jpg"
        >
            <section>
                <p>WhatsApp is one of the most powerful sales channels for small businesses in LATAM. However, selling just by sending photos and prices is often chaotic and unprofessional.</p>
                <p>The solution is to <strong>sell on WhatsApp using a connected online store</strong>, which organizes your products and streamlines the process for your customers.</p>
            </section>

            <hr className="my-12 border-gray-100" />

            <section>
                <h2 className="text-3xl font-black text-gray-900 mb-6">Common problems when selling only on WhatsApp</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Sending prices one by one</li>
                    <li>Customers asking the same questions</li>
                    <li>Disorganized orders</li>
                    <li>Lost time and sales</li>
                </ul>
                <p className="mt-6">An online store eliminates all these problems.</p>
            </section>

            <hr className="my-12 border-gray-100" />

            <section>
                <h2 className="text-3xl font-black text-gray-900 mb-6">How does a store connected to WhatsApp work?</h2>
                <p>An online store for WhatsApp allows:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>The customer to view your entire catalog</li>
                    <li>Select products</li>
                    <li>Send the order directly to your WhatsApp</li>
                </ul>
                <p className="mt-6">All without intermediaries or commissions.</p>
            </section>

            <hr className="my-12 border-gray-100" />

            <section>
                <h2 className="text-3xl font-black text-gray-900 mb-6">Steps to sell on WhatsApp with Creatiendas</h2>
                <ol className="list-decimal pl-6 space-y-3">
                    <li>Create your free online store</li>
                    <li>Upload your products</li>
                    <li>Configure your WhatsApp number</li>
                    <li>Share your store link</li>
                </ol>
                <p className="mt-6">When a customer places an order, it arrives automatically on your WhatsApp with full details.</p>
            </section>

            <hr className="my-12 border-gray-100" />

            <section>
                <h2 className="text-3xl font-black text-gray-900 mb-6">Benefits of selling on WhatsApp with an online store</h2>
                <ul className="list-disc pl-6 space-y-2 font-bold text-green-600">
                    <li>More professionalism</li>
                    <li>Fewer repetitive messages</li>
                    <li>Higher closing rate</li>
                    <li>Better customer experience</li>
                </ul>
            </section>

            <hr className="my-12 border-gray-100" />

            <section>
                <h2 className="text-3xl font-black text-gray-900 mb-6">Who is this model ideal for?</h2>
                <div className="flex flex-wrap gap-3">
                    {["Entrepreneurs", "Small Stores", "Local Businesses", "New Brands", "Dropshipping"].map((tag) => (
                        <span key={tag} className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 font-bold text-sm">
                            {tag}
                        </span>
                    ))}
                </div>
            </section>

            <hr className="my-12 border-gray-100" />

            <section>
                <h2 className="text-3xl font-black text-gray-900 mb-6">Conclusion</h2>
                <p>If you already sell on WhatsApp, a connected online store is the logical next step to sell more and waste less time.</p>
            </section>
        </ArticleLayoutEN>
    );
}
