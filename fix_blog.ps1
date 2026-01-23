
$path = "c:\Users\ASUS\Desktop\creatiendas\creatiendasgit\src\data\blogPosts.tsx"
$content = Get-Content $path -Raw -Encoding UTF8

$R = [char]0xFFFD
$VS16 = [char]0xFE0F

# Helper function to safe replace
function Safe-Replace {
    param($InputString, $OldValue, $NewValue)
    return $InputString.Replace($OldValue, $NewValue)
}

# x  -> 💡
$content = Safe-Replace $content ($R + "x " + $R + " Cómo") "💡 Cómo"
$content = Safe-Replace $content ($R + "x " + $R + " Tip") "💡 Tip"
$content = Safe-Replace $content ($R + "x " + $R + " Estrategia") "💡 Estrategia"

# xa -> 🚀
$content = Safe-Replace $content ($R + "xa" + $R + " Lanzar") "🚀 Lanzar"
$content = Safe-Replace $content "xa Lanzar" "🚀 Lanzar"
$content = Safe-Replace $content ($R + "xa" + $R + " Por qué") "🚀 Por qué"
$content = Safe-Replace $content "xa Por qué" "🚀 Por qué"

# a -> ⚠️
$content = Safe-Replace $content ("a" + $R + " Costo") "⚠️ Costo"
$content = Safe-Replace $content ($R + "a" + $R + " Costo") "⚠️ Costo"
$content = Safe-Replace $content ("a" + $R + $VS16 + " Costo") "⚠️ Costo"

# S& -> ✅
$content = Safe-Replace $content ($R + "S& Ventaja") "✅ Ventaja"
$content = Safe-Replace $content "S& Ventaja" "✅ Ventaja"
$content = Safe-Replace $content ($R + "S& Paso") "✅ Paso"
$content = Safe-Replace $content "S& Paso" "✅ Paso"

# R -> ❌
$content = Safe-Replace $content ($R + "R Desventaja") "❌ Desventaja"
$content = Safe-Replace $content "R Desventaja" "❌ Desventaja"
$content = Safe-Replace $content ($R + "R Problemas") "❌ Problemas"
$content = Safe-Replace $content "R Problemas" "❌ Problemas"

# Misc
$content = Safe-Replace $content "HAZLO Ta MISMO" "HAZLO TÚ MISMO"
$content = Safe-Replace $content ("comunes a" + $R) "comunes ⚠️"
$content = Safe-Replace $content ("comunes " + $R + "a" + $R) "comunes ⚠️"
$content = Safe-Replace $content "anete a la" "Únete a la"

# Mobile
$content = Safe-Replace $content ($R + "x " + $R + " El Fenómeno") "📱 El Fenómeno"
$content = Safe-Replace $content "x  El Fenómeno" "📱 El Fenómeno"

# Search
$content = Safe-Replace $content ($R + "x " + $R + " ¿Cómo buscan") "🔍 ¿Cómo buscan"
$content = Safe-Replace $content "x  ¿Cómo buscan" "🔍 ¿Cómo buscan"
$content = Safe-Replace $content ($R + "x " + $R + " El Secreto") "🔍 El Secreto"
$content = Safe-Replace $content "x  El Secreto" "🔍 El Secreto"

# Balance
$content = Safe-Replace $content ($R + "x ` Comparativa") "⚖️ Comparativa" # Backtick escape space
$content = Safe-Replace $content "x ` Comparativa" "⚖️ Comparativa"

# Warning
$content = Safe-Replace $content ($R + "x:" + $R + " El abismo") "⚠️ El abismo"
$content = Safe-Replace $content "x: El abismo" "⚠️ El abismo"

# Thinking
$content = Safe-Replace $content ($R + "x " + $R + " ¿Por qué") "🤔 ¿Por qué"
$content = Safe-Replace $content "x ¿Por qué" "🤔 ¿Por qué"
$content = Safe-Replace $content ($R + "x" + $R + " ¿Por qué") "🤔 ¿Por qué"

# Grid items - Be careful with quotes
$content = Safe-Replace $content 'block">x ' 'block">💳'
$content = Safe-Replace $content ('block">' + $R + 'x ' + $R) 'block">💳'

$content = Safe-Replace $content 'block">S&' 'block">🤝'
$content = Safe-Replace $content ('block">' + $R + 'S&') 'block">🤝'

$content = Safe-Replace $content 'block">R' 'block">❌'
$content = Safe-Replace $content ('block">' + $R + 'R') 'block">❌'

$content = Safe-Replace $content 'font-bold">S"' 'font-bold">❌'
$content = Safe-Replace $content 'font-bold">x "' 'font-bold">❌'

$content = Safe-Replace $content 'Catálogo Profesional x ' 'Catálogo Profesional 📚'
$content = Safe-Replace $content 'Estados de WhatsApp x ' 'Estados de WhatsApp 📺'

$content = Safe-Replace $content 'Dato Real de Impacto' '📈 Dato Real de Impacto'
$content = Safe-Replace $content 'x  Dato Real' '📈 Dato Real'
$content = Safe-Replace $content ($R + 'x ' + $R + ' Dato Real') '📈 Dato Real'

$content = Safe-Replace $content ($R + 'x:  El modelo') '🔄 El modelo'
$content = Safe-Replace $content 'x:  El modelo' '🔄 El modelo'

$content = Safe-Replace $content ($R + 'x' + $R + '  Hiper-personalización') '🤖 Hiper-personalización'
$content = Safe-Replace $content 'x  Hiper' '🤖 Hiper'

$content = Safe-Replace $content ($R + 'x   El Caos') '⚖️ El Caos'
$content = Safe-Replace $content 'x   El Caos' '⚖️ El Caos'


Set-Content $path $content -Encoding UTF8
Write-Host "Fixed blog posts encoding"
