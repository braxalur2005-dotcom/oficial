function Hero({ setCurrentView }) {
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [videoMissing, setVideoMissing] = useState(false);
    const LOCAL_VIDEO_SRC = 'video/nexus-intro.mp4';
    const POSTER_SRC = 'img/gif.gif';

    return (
        <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-nexus-purple rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob"></div>
            <div className="absolute top-20 right-1/4 w-96 h-96 bg-nexus-blue rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob" style={{animationDelay: '2s'}}></div>
            <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-nexus-accent rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob" style={{animationDelay: '4s'}}></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-5xl md:text-7xl font-bold mb-6">
                    Construimos el <span className="gradient-text">Futuro Digital</span>
                </h1>
                <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                    Desarrollamos aplicaciones web profesionales, escalables y orientadas al usuario que impulsan tu negocio al siguiente nivel.
                </p>

                <div className="flex justify-center mb-10">
                    <div className="relative w-full max-w-2xl overflow-hidden rounded-[1.5rem] bg-black/40 shadow-[0_20px_50px_rgba(0,0,0,0.22)]">
                        <div className="absolute inset-0 bg-gradient-to-br from-nexus-blue/10 via-transparent to-nexus-purple/10 pointer-events-none" />
                        <div className="relative aspect-video">
                            {videoMissing ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950 text-center px-6">
                                    <img
                                        src={POSTER_SRC}
                                        alt="Nexus"
                                        className="absolute inset-0 h-full w-full object-cover opacity-30"
                                    />
                                    <p className="relative text-sm text-gray-300 max-w-sm">
                                        Todavía no agregaste el video de presentación. Coloca tu archivo
                                        en <code className="text-nexus-accent">video/nexus-intro.mp4</code>.
                                    </p>
                                </div>
                            ) : videoLoaded ? (
                                <video
                                    className="absolute inset-0 h-full w-full object-cover"
                                    src={LOCAL_VIDEO_SRC}
                                    poster={POSTER_SRC}
                                    controls
                                    autoPlay
                                    playsInline
                                    onError={() => setVideoMissing(true)}
                                />
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setVideoLoaded(true)}
                                    className="group relative flex h-full w-full items-center justify-center overflow-hidden bg-slate-950"
                                    aria-label="Reproducir video de presentación"
                                >
                                    <img
                                        src={POSTER_SRC}
                                        alt="Presentación Nexus"
                                        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                    />
                                    <span className="absolute inset-0 bg-black/30 transition duration-300 group-hover:bg-black/40" />
                                    <span className="absolute inset-0 flex items-center justify-center">
                                        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-nexus-purple/95 text-white shadow-[0_15px_40px_rgba(109,40,217,0.4)] transition-transform duration-300 group-hover:scale-110">
                                            <svg viewBox="0 0 24 24" className="h-8 w-8">
                                                <path fill="currentColor" d="M8 5v14l11-7z" />
                                            </svg>
                                        </span>
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-center space-x-4">
                    <button onClick={() => setCurrentView('packages')} className="btn-primary">Ver Paquetes</button>
                    <button onClick={() => setCurrentView('contact')} className="btn-secondary">Contáctanos</button>
                </div>
            </div>
        </div>
    );
}
