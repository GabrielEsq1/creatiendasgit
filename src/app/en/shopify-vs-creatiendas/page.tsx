import React from 'react';
import ArticleLayoutEN from '@/components/en/ArticleLayoutEN';

export default function ShopifyVsCreatiendasPageEN() {
    return (
        <ArticleLayoutEN
            title="Shopify vs Creatiendas: which is better for small businesses?"
            heroImage="/images/blog/shopify-vs-creatiendas.jpg"
        >
            <section>
                <p>Choosing the right platform to sell online is key, especially if you are just starting out. Two common options are Shopify and Creatiendas, but they are designed for very different audiences.</p>
                <p>In this comparison, we show you <strong>which one is best for small businesses and entrepreneurs</strong>.</p>
            </section>

            <hr className="my-12 border-gray-100" />

            <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="bg-red-50 p-8 rounded-[2rem] border border-red-100">
                    <h2 className="text-2xl font-black text-red-600 mb-6">Shopify</h2>
                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-900">Pros:</h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                            <li>Robust platform</li>
                            <li>Many integrations</li>
                            <li>Scalable</li>
                        </ul>
                        <h3 className="font-bold text-gray-900 mt-6">Cons:</h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                            <li>Monthly payment in USD</li>
                            <li>Additional fees</li>
                            <li>More complex configuration</li>
                            <li>WhatsApp is not native</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-green-50 p-8 rounded-[2rem] border border-green-100">
                    <h2 className="text-2xl font-black text-green-600 mb-6">Creatiendas</h2>
                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-900">Pros:</h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                            <li>100% free</li>
                            <li>No commissions</li>
                            <li>Setup in 2 minutes</li>
                            <li>Integrated WhatsApp</li>
                            <li>Ideal for LATAM</li>
                        </ul>
                        <h3 className="font-bold text-gray-900 mt-6">Cons:</h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                            <li>Focused on SMBs (not enterprise)</li>
                        </ul>
                    </div>
                </div>
            </section>

            <hr className="my-12 border-gray-100" />

            <section>
                <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Direct Comparison</h2>
                {/* Mobile-friendly scrollable table container */}
                <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden rounded-[1rem] md:rounded-[2rem] border border-gray-100 shadow-xl">
                            <table className="min-w-full text-left bg-white">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="p-3 md:p-6 font-bold text-gray-900 text-sm md:text-base whitespace-nowrap">Feature</th>
                                        <th className="p-3 md:p-6 font-bold text-gray-900 text-sm md:text-base whitespace-nowrap">Shopify</th>
                                        <th className="p-3 md:p-6 font-bold text-green-600 text-sm md:text-base whitespace-nowrap">Creatiendas</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    <tr>
                                        <td className="p-3 md:p-6 text-gray-700 font-medium text-sm md:text-base whitespace-nowrap">Monthly price</td>
                                        <td className="p-3 md:p-6 text-red-500 font-bold text-sm md:text-base whitespace-nowrap">$29 USD / month</td>
                                        <td className="p-3 md:p-6 text-green-600 font-black text-sm md:text-base whitespace-nowrap">Free</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3 md:p-6 text-gray-700 font-medium text-sm md:text-base whitespace-nowrap">Commissions</td>
                                        <td className="p-3 md:p-6 text-red-500 font-bold text-sm md:text-base whitespace-nowrap">Yes</td>
                                        <td className="p-3 md:p-6 text-green-600 font-black text-sm md:text-base whitespace-nowrap">No</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3 md:p-6 text-gray-700 font-medium text-sm md:text-base whitespace-nowrap">Setup time</td>
                                        <td className="p-3 md:p-6 text-gray-500 text-sm md:text-base whitespace-nowrap">Hours or days</td>
                                        <td className="p-3 md:p-6 text-green-600 font-black text-sm md:text-base whitespace-nowrap">2 minutes</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3 md:p-6 text-gray-700 font-medium text-sm md:text-base whitespace-nowrap">WhatsApp</td>
                                        <td className="p-3 md:p-6 text-gray-500 text-sm md:text-base whitespace-nowrap">Plugins</td>
                                        <td className="p-3 md:p-6 text-green-600 font-black text-sm md:text-base whitespace-nowrap">Integrated</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3 md:p-6 text-gray-700 font-medium text-sm md:text-base whitespace-nowrap">Ideal for</td>
                                        <td className="p-3 md:p-6 text-gray-500 text-sm md:text-base whitespace-nowrap">Large companies</td>
                                        <td className="p-3 md:p-6 text-green-600 font-black text-sm md:text-base whitespace-nowrap">SMBs</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {/* Scroll hint for mobile */}
                <p className="text-center text-xs text-gray-400 mt-3 md:hidden">← Swipe to see full table →</p>
            </section>

            <hr className="my-12 border-gray-100" />

            <section className="bg-gray-900 text-white p-12 rounded-[3rem] text-center">
                <h2 className="text-3xl font-black mb-6">Which one should you choose?</h2>
                <div className="space-y-4 text-xl">
                    <p>👉 If you are starting out and selling via WhatsApp <span className="text-green-400 font-black">→ Creatiendas</span></p>
                    <p>👉 If you have a technical team and budget <span className="text-blue-400 font-bold">→ Shopify</span></p>
                </div>
            </section>

            <hr className="my-12 border-gray-100" />

            <section>
                <h2 className="text-3xl font-black text-gray-900 mb-6">Conclusion</h2>
                <p>For small businesses looking to sell fast, without costs or friction, Creatiendas is the most convenient option.</p>
            </section>
        </ArticleLayoutEN>
    );
}
