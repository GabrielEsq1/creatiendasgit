import React from 'react';

export default function FinalCTAEN() {
    return (
        <section className="py-12 md:py-16 px-4 md:px-8 lg:px-16 bg-[#22c55e] text-white text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Try your idea</h3>
            <p className="mb-6 max-w-2xl mx-auto text-base md:text-lg">
                Don't commit to the platform yet. Explore, validate, and decide later.
            </p>
            <a
                href="/en/auth/register"
                className="inline-block w-full sm:w-auto bg-white text-[#22c55e] font-bold px-8 py-4 rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
                Start without risk
            </a>
        </section>
    );
}
