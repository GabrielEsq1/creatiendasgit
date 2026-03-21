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
import { SocialProofSection } from '@/components/SocialProofSection';
import SoftwareSchema from '@/components/SoftwareSchema';
import FAQSchema from '@/components/FAQSchema';
import LocalBusinessSchema from '@/components/LocalBusinessSchema';
import SuccessBanner from '@/components/SuccessBanner';
import PricingSection from '@/components/PricingSection';

import StickyMobileCTA from '@/components/StickyMobileCTA';

export default function EnglishLandingPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-green-500/30">
            <SoftwareSchema lang="en" />
            <FAQSchema lang="en" />
            <LocalBusinessSchema lang="en" />
            <SuccessBanner />
            <StickyMobileCTA lang="en" />
            <main className="flex-1">
                <HeroEN />
                <WhatIsEN />

                {/* VALIDATION: Real metrics (Psychological Step 3) */}
                <div className="py-8 bg-slate-50/50">
                    <div className="max-w-7xl mx-auto px-4 md:px-8">
                        <SocialProofSection lang="en" />
                    </div>
                </div>

                <BenefitsEN />
                <HowItWorksEN />
                <div id="demo">
                    <LiveDemoEN />
                </div>
                <FeaturesEN />
                {/* PRICING: After they understand the value */}
                <PricingSection locale="en" />
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
