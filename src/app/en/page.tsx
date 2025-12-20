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

import FestiveManager from '@/components/FestiveManager';

export default function EnglishLandingPage() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col selection:bg-green-500/30">
            <FestiveManager />
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
            <footer className="bg-slate-900 p-12 text-center border-t border-slate-800">
                <div className="flex justify-center gap-4 mb-4 text-2xl">
                    <span>🎄</span><span>❄</span><span>🎁</span><span>✨</span>
                </div>
                <p className="text-slate-500 font-medium">
                    © {new Date().getFullYear()} Creatiendas. Made with ❤️ in LATAM 🎅
                </p>
            </footer>
        </div>
    );
}
