import React from 'react';
export const dynamic = 'force-dynamic';

import HeroEN from '@/components/en/HeroEN';
import WhatIsEN from '@/components/en/WhatIsEN';
import BenefitsEN from '@/components/en/BenefitsEN';
import HowItWorksEN from '@/components/en/HowItWorksEN';
import LiveDemoEN from '@/components/en/LiveDemoEN';
import FeaturesEN from '@/components/en/FeaturesEN';
import BlogSectionEN from '@/components/en/BlogSectionEN';
import TestimonialsEN from '@/components/en/TestimonialsEN';
import FinalCTAEN from '@/components/en/FinalCTAEN';

export default function EnglishLandingPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-green-500/30">
            <main className="flex-1">
                <HeroEN />
                <WhatIsEN />
                <BenefitsEN />
                <HowItWorksEN />
                <div id="demo">
                    <LiveDemoEN />
                </div>
                <FeaturesEN />
                <BlogSectionEN />
                <TestimonialsEN />
                <FinalCTAEN />
            </main>
            <footer className="bg-slate-50 p-12 text-center border-t border-slate-100">
                <p className="text-slate-500 font-medium font-bold uppercase tracking-widest text-xs">
                    © {new Date().getFullYear()} Creatiendas. Made with ❤️ in LATAM
                </p>
            </footer>
        </div>
    );
}
