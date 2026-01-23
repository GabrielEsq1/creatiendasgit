$path = "c:\Users\ASUS\Desktop\creatiendas\creatiendasgit\src\data\blogPosts.tsx"
$lines = Get-Content $path
$lines[603] = '                    <h2 className="text-3xl font-black text-gray-900 mb-6">💸 ¿Por qué elegir un modelo sin comisiones?</h2>'
$lines[825] = '                            <h4 className="font-bold text-lg mb-2">3. Cierre conversacional 💬</h4>'
$lines[832] = '                    <h2 className="text-2xl font-bold mb-4">💡 Tip Pro: El Checkout es solo el inicio</h2>'
$lines[847] = '                    <h2 className="text-3xl font-black text-gray-900 mb-6">⚔️ El duelo del Ecommerce: Gigante Global vs. Aliado Local</h2>'
$lines[852] = '                    <h3 className="text-2xl font-bold text-gray-900 mb-6">📊 Análisis de Costos (Empezando un negocio)</h3>'
$lines[889] = '                    <h2 className="text-3xl font-black text-gray-900 mb-6">🌍 Diferencias de Mercado</h2>'
$lines | Set-Content $path -Encoding UTF8
Write-Host "Emojis fixed."
