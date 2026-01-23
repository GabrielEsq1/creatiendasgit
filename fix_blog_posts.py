
import os

file_path = r'c:\Users\ASUS\Desktop\creatiendas\creatiendasgit\src\data\blogPosts.tsx'

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
except UnicodeDecodeError:
    with open(file_path, 'r', encoding='latin-1') as f:
        content = f.read()

# Define replacements
# Using \ufffd for 
replacements = [
    ('<strong>\ufffdx \ufffd Cómo implementarlo', '<strong>💡 Cómo implementarlo'),
    ('<strong>\ufffdx \ufffd Tip', '<strong>💡 Tip'),
    ('<strong>\ufffdx \ufffd Estrategia', '<strong>💡 Estrategia'),
    ('\ufffdxa\ufffd Lanzar', '🚀 Lanzar'),
    ('xa Lanzar', '🚀 Lanzar'), # fallback
    ('\ufffdxa\ufffd Por qué', '🚀 Por qué'),
    ('xa Por qué', '🚀 Por qué'), # fallback
    ('\ufffda\ufffd\ufe0f Costo', '⚠️ Costo'),
    ('a\ufffd\ufe0f Costo', '⚠️ Costo'), # fallback
    ('a\ufe0f Costo', '⚠️ Costo'), # fallback
    ('\ufffdS& Ventaja', '✅ Ventaja'),
    ('S& Ventaja', '✅ Ventaja'), # fallback
    ('\ufffdR Desventaja', '❌ Desventaja'),
    ('R Desventaja', '❌ Desventaja'), # fallback
    ('HAZLO Ta MISMO', 'HAZLO TÚ MISMO'),
    ('comunes \ufffda\ufffd\ufe0f', 'comunes ⚠️'),
    ('comunes a\ufffd\ufe0f', 'comunes ⚠️'),
    ('\ufffdx \ufffd El Fenómeno Mobile-Only', '📱 El Fenómeno Mobile-Only'),
    ('x  El Fenómeno Mobile-Only', '📱 El Fenómeno Mobile-Only'),
    ('anete a la nueva generation', 'Únete a la nueva generación'), # English version fix? No spanish.
    ('anete a la nueva generaci', 'Únete a la nueva generaci'),
    ('anete a la nueva', 'Únete a la nueva'),
    ('\ufffdx \ufffd ¿Cómo buscan', '🔍 ¿Cómo buscan'),
    ('x  ¿Cómo buscan', '🔍 ¿Cómo buscan'),
    ('\ufffdx \ufffd El Secreto del SEO', '🔍 El Secreto del SEO'),
    ('x  El Secreto del SEO', '🔍 El Secreto del SEO'),
    ('\ufffdx ` Comparativa', '⚖️ Comparativa'),
    ('x ` Comparativa', '⚖️ Comparativa'),
    ('\ufffdS& Paso a paso', '✅ Paso a paso'),
    ('S& Paso a paso', '✅ Paso a paso'),
    ('\ufffdx:\ufffd\ufe0f El abismo', '⚠️ El abismo'),
    ('x: El abismo', '⚠️ El abismo'),
    ('\ufffdx\ufffd\ufffd ¿Por qué', '🤔 ¿Por qué'),
    ('x ¿Por qué', '🤔 ¿Por qué'),
    
    # Grid items
    ('block">\ufffdx \ufffd', 'block">💳'),
    ('block">x ', 'block">💳'),
    ('block">\ufffdS&', 'block">🤝'),
    ('block">S&', 'block">🤝'),
    ('block">\ufffdR', 'block">❌'), 
    
    ('\ufffdx \ufffd Dato Real', '📈 Dato Real'),
    ('x  Dato', '📈 Dato'),
    
    ('\ufffdx:  El modelo', '🔄 El modelo'),
    ('x:  El modelo', '🔄 El modelo'),
    
    ('\ufffdx\ufffd  Hiper-personalización', '🤖 Hiper-personalización'),
    ('x  Hiper', '🤖 Hiper'),
    
    ('Catálogo Profesional \ufffdx \ufffd', 'Catálogo Profesional 📚'),
    ('Catálogo Profesional x ', 'Catálogo Profesional 📚'),
    
    ('Estados de WhatsApp \ufffdx \ufffd', 'Estados de WhatsApp 📺'),
    ('Estados de WhatsApp x ', 'Estados de WhatsApp 📺'),

    ('\ufffdx   El Caos', '⚖️ El Caos'),
    ('x   El Caos', '⚖️ El Caos'),
    
    ('\ufffdR Problemas comunes', '❌ Problemas comunes'),
    ('R Problemas comunes', '❌ Problemas comunes'),

    ('font-bold">\ufffdS"', 'font-bold">❌'),
    ('font-bold">S"', 'font-bold">❌'),
    
    ('font-bold">\ufffdx \ufffd"', 'font-bold">❌'),
    
    # Specific fix for the "a️"
    ('li className="text-red-500 font-bold">\ufffda\ufffd\ufe0f', 'li className="text-red-500 font-bold">⚠️'),
    ('li className="text-red-500 font-bold">a\ufffd\ufe0f', 'li className="text-red-500 font-bold">⚠️'), 
]

new_content = content
for target, replacement in replacements:
    new_content = new_content.replace(target, replacement)

# Write back
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Replaced {len(replacements)} patterns (if found).")
