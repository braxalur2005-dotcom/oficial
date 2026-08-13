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
            <div className="max-w-3xl mx-auto glass-panel border border-white/10 rounded-2xl p-5 sm:p-6 shadow-[0_10px_40px_rgba(0,0,0,0.4)] flex flex-col sm:flex-row items-center gap-4">
                <p className="text-sm text-gray-300 flex-1">
                    Usamos cookies necesarias para el funcionamiento del sitio y, en su caso, cookies analíticas para mejorar tu experiencia. Puedes leer más en nuestra{' '}
                    <button onClick={() => setCurrentView('cookies')} className="text-nexus-accent underline">Política de Cookies</button>.
                </p>
                <div className="flex gap-3 flex-shrink-0">
                    <button onClick={accept} className="btn-primary py-2 px-6 text-sm whitespace-nowrap">
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
}

