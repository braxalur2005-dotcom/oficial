class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-nexus-dark text-white">
          <div className="text-center p-8 glass-panel">
            <h1 className="text-2xl font-bold mb-4">Algo salió mal</h1>
            <p className="text-gray-400 mb-4">Lo sentimos, ocurrió un error inesperado.</p>
            <button onClick={() => window.location.reload()} className="btn-primary">
              Recargar Página
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
      const handleScroll = () => {
          setShowScrollTop(window.scrollY > 320);
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
      return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
      // Si el usuario ya había iniciado sesión antes, la restauramos automáticamente.
      if (typeof getCurrentUser === 'function') {
          getCurrentUser().then((existingUser) => {
              if (existingUser) setUser(existingUser);
          });
      }
  }, []);

  useEffect(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [currentView]);

  const handleLogin = (userData) => {
      setUser(userData);
      setShowAuth(false);
  };

  const handleLogout = () => {
      if (typeof logoutUser === 'function') logoutUser();
      setUser(null);
      setCurrentView('home');
  };

  const handleUpdateUser = (updatedUser) => {
      setUser(updatedUser);
  };

  const handlePurchaseSuccess = (pkg) => {
      // Refresh user state with updated active package
      if (user) {
          setUser({
              ...user,
              objectData: {
                  ...user.objectData,
                  activePackage: pkg.name
              }
          });
      }
      setCurrentView('profile');
  };

  const services = [
      {
          id: 'desarrollo',
          title: 'Desarrollo a Medida',
          icon: 'icon-monitor',
          buttonBaseClasses: 'w-full text-left rounded-3xl border bg-white/5 p-6 transition duration-300 hover:border-white/20 hover:bg-white/10',
          activeButtonClasses: 'border-nexus-accent/60 bg-nexus-accent/10 shadow-[0_0_30px_rgba(59,130,246,0.18)]',
          badgeClasses: 'inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-nexus-accent/10 border border-nexus-accent/20 text-nexus-accent text-2xl transition-all duration-300',
          cardBadgeClasses: 'inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-white/5 border border-nexus-accent/20 text-nexus-accent text-3xl',
          description: 'Aplicaciones construidas desde cero con las últimas tecnologías y arquitectura robusta.',
          details: 'Sistemas online rápidos, confiables y personalizados para tu negocio. Ideal para proyectos que necesitan un backend sólido, integraciones a medida y una experiencia premium para tus clientes.',
          imageSrc: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
          imageAlt: 'Desarrollo web a medida',
          features: [
              'Interfaces modernas y funcionales',
              'Desarrollo backend escalable',
              'Integraciones con APIs y pasarelas de pago'
          ]
      },
      {
          id: 'diseno',
          title: 'Diseño Responsivo',
          icon: 'icon-smartphone',
          buttonBaseClasses: 'w-full text-left rounded-3xl border bg-white/5 p-6 transition duration-300 hover:border-white/20 hover:bg-white/10',
          activeButtonClasses: 'border-nexus-purple/60 bg-nexus-purple/10 shadow-[0_0_30px_rgba(109,40,217,0.18)]',
          badgeClasses: 'inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-nexus-purple/10 border border-nexus-purple/20 text-nexus-purple text-2xl transition-all duration-300',
          cardBadgeClasses: 'inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-white/5 border border-nexus-purple/20 text-nexus-purple text-3xl',
          description: 'Experiencias fluidas y adaptables en dispositivos móviles, tablets y escritorio.',
          details: 'Tu sitio se verá impecable en cualquier pantalla, optimizando la experiencia de usuario para lograr más conversiones y una navegación clara desde el primer segundo.',
          imageSrc: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
          imageAlt: 'Diseño de interfaz responsiva',
          features: [
              'Diseño pensado en el usuario',
              'Adaptación perfecta a móviles',
              'Velocidad y usabilidad mejoradas'
          ]
      },
      {
          id: 'rendimiento',
          title: 'Alto Rendimiento',
          icon: 'icon-rocket',
          buttonBaseClasses: 'w-full text-left rounded-3xl border bg-white/5 p-6 transition duration-300 hover:border-white/20 hover:bg-white/10',
          activeButtonClasses: 'border-nexus-blue/60 bg-nexus-blue/10 shadow-[0_0_30px_rgba(29,78,216,0.18)]',
          badgeClasses: 'inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-nexus-blue/10 border border-nexus-blue/20 text-nexus-blue text-2xl transition-all duration-300',
          cardBadgeClasses: 'inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-white/5 border border-nexus-blue/20 text-nexus-blue text-3xl',
          description: 'Carga ultra rápida y optimización extrema de SEO para destacar en buscadores.',
          details: 'Tu web carga veloz, ofrece una experiencia fluida y está lista para escalar. Menos rebotes, mejor posicionamiento y más clientes encontrando tu marca.',
          imageSrc: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
          imageAlt: 'Optimización de rendimiento web',
          features: [
              'Optimización de velocidad',
              'SEO técnico desde el inicio',
              'Rendimiento estable en todo momento'
          ]
      },
      {
          id: 'cotizacion',
          title: 'Cotización Inteligente',
          icon: 'icon-calculator',
          buttonBaseClasses: 'w-full text-left rounded-3xl border bg-white/5 p-6 transition duration-300 hover:border-white/20 hover:bg-white/10',
          activeButtonClasses: 'border-nexus-accent/60 bg-nexus-accent/10 shadow-[0_0_30px_rgba(59,130,246,0.18)]',
          badgeClasses: 'inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-nexus-accent/10 border border-nexus-accent/20 text-nexus-accent text-2xl transition-all duration-300',
          cardBadgeClasses: 'inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-white/5 border border-nexus-accent/20 text-nexus-accent text-3xl',
          description: 'Tu cliente describe el daño, el sistema calcula el costo al instante. Sin llamadas, sin esperas.',
          details: 'Cotizaciones automáticas 24/7 directamente en tu sitio. Tu cliente describe el daño, el sistema calcula el costo al instante. Sin llamadas, sin esperas.',
          imageSrc: 'img/cotizador-inteligente.jpg.png',
          imageAlt: 'Cotizador Inteligente Newo Studio Tecno',
          features: [
              'Formulario guiado por dispositivo',
              'Precios en tiempo real',
              'Envío automático al cliente'
          ]
      },
      {
          id: 'rastreador',
          title: 'Rastreador de Órdenes en Tiempo Real',
          icon: 'icon-loader',
          buttonBaseClasses: 'w-full text-left rounded-3xl border bg-white/5 p-6 transition duration-300 hover:border-white/20 hover:bg-white/10',
          activeButtonClasses: 'border-nexus-purple/60 bg-nexus-purple/10 shadow-[0_0_30px_rgba(109,40,217,0.18)]',
          badgeClasses: 'inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-nexus-purple/10 border border-nexus-purple/20 text-nexus-purple text-2xl transition-all duration-300',
          cardBadgeClasses: 'inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-white/5 border border-nexus-purple/20 text-nexus-purple text-3xl',
          description: 'Tu cliente ve el estatus real de su equipo sin llamadas interminables.',
          details: 'Se acabaron las llamadas de “¿ya está listo mi aparato?”. Tu cliente usa su número de orden y ve un semáforo en vivo con el estatus real: Recibido, En diagnóstico, En reparación y Listo.',
          imageSrc: 'img/rastreador-ordenes.jpg.png',
          imageAlt: 'Rastreador de Órdenes en Tiempo Real Newo Studio Tecno',
          features: [
              'Semáforo visual con 4 estatus claros',
              'Notificaciones automáticas de avance',
              'Cero llamadas repetidas preguntando lo mismo'
          ]
      },
      {
          id: 'ubicacion',
          title: 'Ubicación Digital Estratégica',
          icon: 'icon-map-pin',
          buttonBaseClasses: 'w-full text-left rounded-3xl border bg-white/5 p-6 transition duration-300 hover:border-white/20 hover:bg-white/10',
          activeButtonClasses: 'border-nexus-blue/60 bg-nexus-blue/10 shadow-[0_0_30px_rgba(29,78,216,0.18)]',
          badgeClasses: 'inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-nexus-blue/10 border border-nexus-blue/20 text-nexus-blue text-2xl transition-all duration-300',
          cardBadgeClasses: 'inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-white/5 border border-nexus-blue/20 text-nexus-blue text-3xl',
          description: 'Aparece primero cuando clientes de tu zona buscan reparación cerca de ti.',
          details: 'Cuando alguien busca en Google “reparación de celulares cerca de mí”, queremos que salgas tú primero. Configuramos tu página para posicionarla como la opción más cercana y confiable de tu zona.',
          imageSrc: 'img/ubicacion-digital.jpg.png',
          imageAlt: 'Ubicación Digital Estratégica Newo Studio Tecno',
          features: [
              'Apareces primero en búsquedas de tu zona',
              'Ficha de Google optimizada con mapa, horarios y reseñas',
              'Más clientes nuevos sin gastar en anuncios'
          ]
      }
  ];

  const [activeService, setActiveService] = useState('desarrollo');
  const activeServiceItem = services.find((item) => item.id === activeService) || services[0];
  const touchStartX = useRef(null);
  const digitalCardStyles = `
    .strategy-card {
      width: 100%;
      min-height: 180px;
      border-radius: 20px;
      padding: 5px;
      box-shadow: rgba(151, 65, 252, 0.2) 0 15px 30px -5px;
      background-image: linear-gradient(144deg,#AF40FF, #5B42F3 50%,#00DDEB);
    }

    .strategy-card__content {
      background: rgb(2, 3, 32);
      border-radius: 17px;
      width: 100%;
      height: 100%;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }
  `;

  const changeService = (direction) => {
      const currentIndex = services.findIndex((item) => item.id === activeService);
      if (currentIndex === -1) return;
      const nextIndex = direction === 'next'
          ? Math.min(currentIndex + 1, services.length - 1)
          : Math.max(currentIndex - 1, 0);
      setActiveService(services[nextIndex].id);
  };

  const handleTouchStart = (event) => {
      touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event) => {
      if (touchStartX.current === null) return;
      const touchEndX = event.changedTouches[0].clientX;
      const deltaX = touchEndX - touchStartX.current;
      if (deltaX > 50) {
          changeService('prev');
      } else if (deltaX < -50) {
          changeService('next');
      }
      touchStartX.current = null;
  };

  const isAdmin = user?.objectData?.email === 'nexus.atencion@outlook.com';

  if (isAdmin) {
    return (
      <div data-name="app" data-file="app.js">
        <AdminDashboard user={user} onLogout={handleLogout} />
      </div>
    );
  }
  

  return (
    <div className="min-h-screen flex flex-col relative" data-name="app" data-file="app.js">
      <style>{digitalCardStyles}</style>
      <div className="absolute inset-0 -z-20 pointer-events-none">
        <div className="container absolute inset-0">
          <div id="stars"></div>
          <div id="stars2"></div>
          <div id="stars3"></div>
        </div>
      </div>
      <div className="absolute inset-0 -z-10 bg-black/20 pointer-events-none"></div>
      <Navbar currentView={currentView} setCurrentView={setCurrentView} user={user} setShowAuth={setShowAuth} />
      
      <main className="flex-1">
        {currentView === 'home' && (
            <div>
                <Hero setCurrentView={setCurrentView} />
      <section className="max-w-7xl mx-auto px-4 pb-8 sm:pb-12">
                    <div className="rounded-[2rem] border border-white/10 bg-transparent p-6 shadow-none sm:p-8 lg:p-10">
                        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                            <div className="max-w-2xl">
                                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-nexus-accent/80">Estrategia digital clara</p>
                                <h2 className="text-3xl font-bold text-white sm:text-4xl">
                                    Creamos sitios web que <span className="gradient-text">mejoran tu presencia y convierten</span>
                                </h2>
                                <p className="mt-5 text-lg leading-8 text-gray-300">
                                    Diseñamos experiencias digitales rápidas, accesibles y preparadas para SEO orgánico para que tu negocio sea encontrado, entienda mejor a sus clientes y crezca con confianza.
                                </p>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                {[
                                    {
                                        title: 'SEO orgánico',
                                        text: 'Estructura clara, contenido estratégico y buenas prácticas para ganar visibilidad en Google.'
                                    },
                                    {
                                        title: 'Rendimiento',
                                        text: 'Carga rápida y diseño optimizado para que la experiencia sea fluida desde el primer segundo.'
                                    },
                                    {
                                        title: 'Accesibilidad',
                                        text: 'Interfaces comprensibles, contrastes adecuados y navegación intuitiva para todos los usuarios.'
                                    },
                                    {
                                        title: 'Automatización',
                                        text: 'Procesos más ágiles para que tu negocio opere de forma más inteligente.'
                                    }
                                ].map((item) => (
                                    <div key={item.title} className="strategy-card">
                                        <div className="strategy-card__content">
                                            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                                            <p className="mt-2 text-sm leading-7 text-gray-400">{item.text}</p>
                                        </div>
                                    </div>
                <section className="max-w-7xl mx-auto px-4 py-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold">SOLUCIONES DIGITALES QUE <span className="gradient-text">TRABAJAN POR TI</span></h2>
                    </div>
 
                    <div className="px-0">
                        <div className="mx-auto max-w-6xl">
                            <div className="mb-6 flex items-center justify-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => changeService('prev')}
                                    className="button group"
                                    aria-label="Sección anterior"
                                >
                                    <span className="button-content">
                                        <svg
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            className="button-icon button-icon-left"
                                        >
                                            <path d="M11 19l-7-7 7-7m8 14l-7-7 7-7" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"></path>
                                        </svg>
                                    </span>
                                </button>
 
                                <div className="min-w-0 flex-1 text-center">
                                    <span className="text-sm font-semibold uppercase tracking-[0.35em] text-nexus-accent/80">
                                        {activeServiceItem.title}
                                    </span>
                                </div>
 
                                <button
                                    type="button"
                                    onClick={() => changeService('next')}
                                    className="button group"
                                    aria-label="Sección siguiente"
                                >
                                    <span className="button-content">
                                        <svg
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            className="button-icon button-icon-right"
                                        >
                                            <path d="M13 5l7 7-7 7M5 5l7 7-7 7" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"></path>
                                        </svg>
                                    </span>
                                </button>
                            </div>
 
                            <div
                                className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-transparent p-4 shadow-none sm:p-6 lg:p-8"
                                onTouchStart={handleTouchStart}
                                onTouchEnd={handleTouchEnd}
                                style={{ touchAction: 'pan-y' }}
                            >
                                <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center">
                                    <div>
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className={activeServiceItem.cardBadgeClasses}>
                                                <i className={activeServiceItem.icon}></i>
                                            </div>
                                            <div>
                                                <p className="text-sm uppercase tracking-[0.35em] text-nexus-accent/80">{activeServiceItem.title}</p>
                                                <h3 className="mt-2 text-3xl font-semibold text-white">{activeServiceItem.title}</h3>
                                            </div>
                                        </div>
                                        <p className="text-gray-300 leading-relaxed mb-8">{activeServiceItem.details}</p>
                                        <ul className="space-y-4">
                                            {activeServiceItem.features.map((feature) => (
                                                <li key={feature} className="flex items-start gap-3 text-gray-200">
                                                    <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-nexus-accent/15 text-nexus-accent">✓</span>
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="group rounded-[1.75rem] overflow-hidden border border-white/10 bg-black/10 shadow-[0_12px_50px_rgba(0,0,0,0.35)] transition-transform duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
                                        <img src={activeServiceItem.imageSrc} alt={activeServiceItem.imageAlt} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="ubicacion" className="section section--alt mt-20">
                    <div className="max-w-7xl mx-auto px-4 py-16">
                        <h2 className="section__title text-3xl lg:text-4xl font-bold text-white mb-10">EL CORAZÓN <span className="gradient-text">DIGITAL DE POLANCO</span></h2>
                        <div className="location grid gap-8 lg:grid-cols-[0.9fr_1.1fr] items-start">
                            <div className="location__cards grid gap-6">
                                <div className="info-card bg-white/5 border border-white/10 rounded-[1.5rem] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.18)]">
                                    <span className="info-card__label text-xs uppercase tracking-[0.35em] text-nexus-accent/80">DIRECCIÓN</span>
                                    <p className="info-card__main text-2xl font-semibold text-white mt-4">Polanco</p>
                                    <p className="info-card__sub text-gray-400 mt-3">Miguel Hidalgo<br />CDMX, México</p>
                                </div>
                                <a
                                    href="https://www.google.com/maps/dir/?api=1&destination=19.4326,-99.1985"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-nexus-blue to-nexus-purple px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
                                >
                                    ABRIR EN GOOGLE MAPS
                                </a>
                            </div>
                            <div className="location__map rounded-[1.75rem] overflow-hidden border border-white/10 bg-black/10 shadow-[0_12px_50px_rgba(0,0,0,0.25)]">
                                <iframe
                                    title="Ubicación Nexus - Polanco"
                                    src="https://www.google.com/maps?q=Polanco,Miguel+Hidalgo,CDMX,Mexico&z=14&output=embed"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, minHeight: '24rem' }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )}
        
        {currentView === 'packages' && <Packages user={user} setShowAuth={setShowAuth} onPurchaseSuccess={handlePurchaseSuccess} />}
        {currentView === 'contact' && <Contact />}
        {currentView === 'profile' && <Profile user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />}
      </main>

      <Footer setCurrentView={setCurrentView} />

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed right-6 bottom-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-nexus-purple/95 text-white shadow-[0_18px_50px_rgba(109,40,217,0.35)] transition-all duration-500 ${showScrollTop ? 'opacity-100 translate-y-0 scale-100 animate-pulse-slow' : 'pointer-events-none opacity-0 translate-y-10 scale-95'}`}
        aria-label="Volver arriba"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6">
          <path fill="currentColor" d="M12 5l-7 7h4v7h6v-7h4z" />
        </svg>
      </button>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onLogin={handleLogin} />}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
