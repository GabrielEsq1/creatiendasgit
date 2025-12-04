'use client';

import CreatiendasDashboard from '@/components/enterprise/CreatiendasDashboard';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function DashboardPage() {
    const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedSnippet(id);
        setTimeout(() => setCopiedSnippet(null), 2000);
    };

    const snippets = {
        creatiendas: `<!-- Creatiendas Widget -->
<script>
(function() {
  const btn = document.createElement('button');
  btn.innerHTML = '🏪 Crear Tienda';
  btn.style.cssText = 'position:fixed;bottom:20px;right:20px;background:linear-gradient(135deg,#1877F2,#0866FF);color:white;border:none;padding:15px 25px;border-radius:50px;font-size:16px;font-weight:bold;cursor:pointer;z-index:9998;box-shadow:0 4px 15px rgba(24,119,242,0.3)';
  
  btn.onclick = () => {
    window.open('${typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'}/builder', '_blank');
  };
  
  document.body.appendChild(btn);
})();
</script>`,

        b2bchat: `<!-- B2BChat + Wallet Widget -->
<script>
(function() {
  const btn = document.createElement('button');
  btn.innerHTML = '💬 Chat & Wallet';
  btn.style.cssText = 'position:fixed;bottom:90px;right:20px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;padding:15px 25px;border-radius:50px;font-size:16px;font-weight:bold;cursor:pointer;z-index:9998;box-shadow:0 4px 15px rgba(102,126,234,0.3)';
  
  btn.onclick = () => {
    window.open('${typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'}/wallet', '_blank');
  };
  
  document.body.appendChild(btn);
})();
</script>`
    };

    return (
        <div className="space-y-8">
            {/* Widget Snippets Section */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 Widget Code Snippets</h2>
                <p className="text-gray-600 mb-6">Copy and paste these snippets into your website to integrate Creatiendas widgets</p>

                {/* Creatiendas Snippet */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-blue-600 flex items-center gap-2">
                            🏪 Store Builder Widget
                        </h3>
                        <button
                            onClick={() => copyToClipboard(snippets.creatiendas, 'creatiendas')}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {copiedSnippet === 'creatiendas' ? (
                                <>
                                    <Check className="w-4 h-4" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4" />
                                    Copy Code
                                </>
                            )}
                        </button>
                    </div>
                    <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto border border-gray-200 text-sm">
                        <code className="text-gray-800">{snippets.creatiendas}</code>
                    </pre>
                </div>

                {/* B2BChat Snippet */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-purple-600 flex items-center gap-2">
                            💬 B2BChat + Wallet Widget
                        </h3>
                        <button
                            onClick={() => copyToClipboard(snippets.b2bchat, 'b2bchat')}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            {copiedSnippet === 'b2bchat' ? (
                                <>
                                    <Check className="w-4 h-4" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4" />
                                    Copy Code
                                </>
                            )}
                        </button>
                    </div>
                    <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto border border-gray-200 text-sm">
                        <code className="text-gray-800">{snippets.b2bchat}</code>
                    </pre>
                </div>
            </div>

            {/* Dashboard Component */}
            <CreatiendasDashboard />
        </div>
    );
}
