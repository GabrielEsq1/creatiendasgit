export const routeMappings: Record<string, string> = {
    '/crear-tienda': '/create-store',
    '/crear-tienda-online-gratis': '/create-online-store-free',
    '/vender-por-whatsapp': '/sell-on-whatsapp'
};

export const getTranslatedPath = (pathname: string, toLang: 'es' | 'en'): string => {
    const isEn = pathname.startsWith('/en');
    const currentBase = isEn ? pathname.replace(/^\/en/, '') || '/' : pathname || '/';

    let targetBase = currentBase;
    if (toLang === 'es') {
        // Find ES path from EN value
        const entry = Object.entries(routeMappings).find(([, en]) => en === currentBase);
        targetBase = entry ? entry[0] : currentBase;
        return targetBase;
    } else {
        // Find EN path from ES key
        targetBase = routeMappings[currentBase] || currentBase;
        return `/en${targetBase === '/' ? '' : targetBase}`;
    }
};
