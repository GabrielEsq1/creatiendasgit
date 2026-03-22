import re
import os

files = [
    (r"c:\Users\ASUS\Desktop\creatiendas\creatiendasgit\src\app\auth\login\page.tsx", "login", "es"),
    (r"c:\Users\ASUS\Desktop\creatiendas\creatiendasgit\src\app\en\auth\login\page.tsx", "login", "en"),
    (r"c:\Users\ASUS\Desktop\creatiendas\creatiendasgit\src\app\auth\register\page.tsx", "register", "es"),
    (r"c:\Users\ASUS\Desktop\creatiendas\creatiendasgit\src\app\en\auth\register\page.tsx", "register", "en")
]

for filepath, page_type, lang in files:
    if not os.path.exists(filepath): continue
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We will find the "return (" block
    # and replace the content.
    
    # For login pages:
    if page_type == "login":
        # Extract the original form JSX to reuse in both layouts
        # We need the form block starting from <form onSubmit={handleLogin} to </form>
        form_match = re.search(r'(<form onSubmit=\{handleLogin\}.*?</form>)', content, re.DOTALL)
        if not form_match: continue
        original_form = form_match.group(1)
        
        title = "Bienvenido" if lang == "es" else "Welcome Back"
        subtitle = "Gestiona tu tienda de WhatsApp" if lang == "es" else "Manage your WhatsApp store"
        noaccount = "¿Aún no tienes cuenta?" if lang == "es" else "Don't have an account yet?"
        startfree = "Empieza gratis ahora" if lang == "es" else "Start for free now"
        reglink = "/auth/register" if lang == "es" else "/en/auth/register"
        wa_text = "Ayuda login" if lang == "es" else "Help login"
        prob_title = "¿Problemas para entrar?" if lang == "es" else "Problems logging in?"
        prob_sub = "Ayuda en vivo 24/7" if lang == "es" else "24/7 Live Support"
        chat_btn = "Chatear" if lang == "es" else "Chat"

        mobile_layout = f"""
            {{/* --- MOBILE EXCLUSIVE LAYOUT (CLEAN) --- */}}
            <div className="w-full lg:hidden flex flex-col min-h-[90vh] justify-center px-4 pt-20 pb-10 bg-white relative z-20">
                <div className="w-full max-w-[380px] mx-auto flex flex-col pt-8">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-black text-slate-900 mb-2">{title}</h1>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">{subtitle}</p>
                    </div>

                    {original_form}

                    <p className="text-center mt-8 text-sm text-slate-500 font-medium">
                        {noaccount}{' '}
                        <Link href="{reglink}" className="font-black text-green-600 hover:text-green-500 transition-colors">
                            {startfree}
                        </Link>
                    </p>

                    <a href="https://wa.me/573026687991?text={wa_text}" target="_blank" className="mt-8 bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-sm active:scale-95 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-600 shadow-sm">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-900">{prob_title}</p>
                                <p className="text-[10px] text-slate-500">{prob_sub}</p>
                            </div>
                        </div>
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-lg">{chat_btn}</span>
                    </a>
                </div>
            </div>
"""
        
        # Replace the entire component return
        col_desktop_match = re.search(r'return \(\s*(<div.*?<div.*?max-w-6xl w-full mx-auto grid.*?</form>.*?</p>.*?</div>.*?</div>.*?</div>.*?</div>\s*\);)', content, re.DOTALL)
        if col_desktop_match:
            desktop_layout = col_desktop_match.group(1)
            # Add "hidden lg:flex" to the main parent div inside desktop_layout to hide it on mobile
            desktop_layout = re.sub(r'(<div className=")([^"]*)(flex flex-col justify-center)', r'\1hidden lg:flex lg:\3 \2', desktop_layout, 1)

            new_return = f"""return (
        <div className="w-full bg-slate-50 text-slate-900 selection:bg-green-500/30 font-sans">
            {mobile_layout}
            {{/* --- DESKTOP EXCLUSIVE LAYOUT --- */}}
            {desktop_layout}
        </div>
    );"""
            
            content = content.replace(col_desktop_match.group(0), new_return)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)

    elif page_type == "register":
        form_match = re.search(r'(<form onSubmit=\{handleRegister\}.*?</form>)', content, re.DOTALL)
        if not form_match: continue
        original_form = form_match.group(1)
        
        title_h1_plain = "Crear cuenta" if lang == "es" else "Create"
        title_h1_span = "gratis" if lang == "es" else "free"
        subtitle = "Tu tienda estará lista en el siguiente paso" if lang == "es" else "Your store will be ready in the next step"
        already_account = "¿Ya tienes cuenta?" if lang == "es" else "Already have an account?"
        login_btn = "Iniciar Sesión" if lang == "es" else "Log In"
        login_link = "/auth/login" if lang == "es" else "/en/auth/login"
        copyr = "Todos los derechos reservados." if lang == "es" else "All rights reserved."

        mobile_layout = f"""
            {{/* --- MOBILE EXCLUSIVE LAYOUT --- */}}
            <div className="w-full lg:hidden flex flex-col min-h-[90vh] justify-center px-4 pt-16 pb-10 bg-white relative z-20">
                <div className="w-full max-w-[380px] mx-auto flex flex-col pt-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black text-slate-900 mb-2">{title_h1_plain} <span className="text-green-600">{title_h1_span}</span></h1>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">{subtitle}</p>
                    </div>

                    {original_form}

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-100"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-slate-500 font-bold uppercase tracking-widest text-[10px]">{already_account}</span>
                        </div>
                    </div>

                    <Link href="{login_link}" className="block w-full text-center py-4 px-4 border border-slate-200 rounded-xl font-black text-slate-700 hover:bg-slate-50 transition-all text-base mb-8 shadow-sm active:scale-95">
                        {login_btn}
                    </Link>

                    <p className="text-center text-slate-400 text-[11px] font-medium">
                        © {{new Date().getFullYear()}} Creatiendas. {copyr}
                    </p>
                </div>
            </div>
"""

        col_desktop_match = re.search(r'return \(\s*(<div.*?<div.*?container mx-auto px-4 py-8.*?</form>.*?</div>.*?</div>.*?</div>.*?</div>\s*\);)', content, re.DOTALL)
        if col_desktop_match:
            desktop_layout = col_desktop_match.group(1)
            # Add "hidden lg:block" to the parent div
            desktop_layout = re.sub(r'(<div className=")([^"]*)(min-h-screen)', r'\1hidden lg:block lg:\3 \2', desktop_layout, 1)

            new_return = f"""return (
        <div className="w-full bg-white text-slate-900 selection:bg-green-500/30 font-sans">
            {mobile_layout}
            {{/* --- DESKTOP EXCLUSIVE LAYOUT --- */}}
            {desktop_layout}
        </div>
    );"""
            
            content = content.replace(col_desktop_match.group(0), new_return)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
