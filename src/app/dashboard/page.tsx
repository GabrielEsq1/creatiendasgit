'use client';
export const dynamic = "force-dynamic";

import CreatiendasDashboard from '@/components/enterprise/CreatiendasDashboard';

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <CreatiendasDashboard />
        </div>
    );
}
