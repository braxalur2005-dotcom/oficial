import { useState, useEffect } from 'react';

export default function CookieBanner({ setCurrentView }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const accepted = localStorage.getItem('nexus_cookies_accepted');
        if (!accepted) {
            setVisible(true);
        }
    }, []);

    const accept = () => {
        localStorage.setItem('nexus_cookies_accepted', 'true');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[70] p-4 sm:p-6">
            <div className="max-w-3xl mx-auto bg-nexus-dark border-2 border-nexus-accent/30 rounded-2xl p-6 sm:p-8 shadow-[0_10px_50px_rgba(0,0,0,0.6)] flex flex-col sm:flex-row items-center gap-5">
                <p className="text-base text-gray-200 flex-1 leading-relaxed">
                    Usamos cookies necesarias para el funcionamiento del sitio y, en su caso, cookies analíticas para mejorar tu experiencia. Puedes leer más en nuestra{' '}
                    <button onClick={() => setCurrentView('cookies')} className="text-nexus-accent underline font-semibold">Política de Cookies</button>.
                </p>
                <div className="flex gap-3 flex-shrink-0">
                    <button onClick={accept} className="btn-primary py-3 px-8 text-base whitespace-nowrap">
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
}
