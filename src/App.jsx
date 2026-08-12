import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Packages from './components/Packages.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import AuthModal from './components/AuthModal.jsx';
import Profile from './components/Profile.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import { getCurrentUser, logoutUser } from './utils/db.js';

export class ErrorBoundary extends React.Component {
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

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [adminViewingSite, setAdminViewingSite] = useState(false);
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);

  const goToPrevService = () => {
      setActiveServiceIndex((current) => Math.max(0, current - 1));
  };

  const goToNextService = () => {
      setActiveServiceIndex((current) => Math.min(services.length - 1, current + 1));
  };

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
          imageSrc: 'img/card-desarrollo.jpg',
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
          imageSrc: 'img/card-diseno.jpg',
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
          imageSrc: 'img/card-rendimiento.jpg',
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
          imageSrc: 'img/card-cotizador.jpg',
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
          imageSrc: 'img/card-rastreador.jpg',
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
          imageSrc: 'img/card-ubicacion.jpg',
          imageAlt: 'Ubicación Digital Estratégica Newo Studio Tecno',
          features: [
              'Apareces primero en búsquedas de tu zona',
              'Ficha de Google optimizada con mapa, horarios y reseñas',
              'Más clientes nuevos sin gastar en anuncios'
          ]
      }
  ];

  const digitalCardStyles = `
    .strategy-card {
      width: 100%;
      min-height: 180px;
      border-radius: 20px;
      padding: 5px;
      box-shadow: rgba(151, 65, 252, 0.2) 0 15px 30px -5px;
      background-image: linear-gradient(144deg,#10b981, #34d399 50%,#10b981);
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



  const isAdmin = user?.objectData?.email === 'nexus.atencion@outlook.com';

  if (isAdmin && !adminViewingSite) {
    return (
      <div data-name="app" data-file="app.js">
        <AdminDashboard user={user} onLogout={handleLogout} onViewSite={() => setAdminViewingSite(true)} />
      </div>
    );
  }
  

  return (
    <div className="min-h-screen flex flex-col relative" data-name="app" data-file="app.js">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-nexus-accent focus:text-nexus-dark focus:px-4 focus:py-2 focus:rounded-lg focus:font-semibold">Saltar al contenido principal</a>
      <style>{digitalCardStyles}</style>
      <div className="absolute inset-0 -z-20 pointer-events-none"></div>
      <div className="absolute inset-0 -z-10 bg-black/20 pointer-events-none"></div>
      <Navbar currentView={currentView} setCurrentView={setCurrentView} user={user} setShowAuth={setShowAuth} isAdminViewingSite={isAdmin && adminViewingSite} onReturnToAdmin={() => setAdminViewingSite(false)} />
      
      <main id="main-content" className="flex-1">
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
                                <div className="mt-8 flex flex-wrap gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setCurrentView('contact')}
                                        className="btn-primary"
                                    >
                                        Solicitar propuesta
                                    </button>
                                </div>
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
                                        text: 'Procesos más ágiles para que tu negocio opere de forma más inteligente, eficiente y rápida.'
                                    }
                                ].map((item) => (
                                    <div key={item.title} className="strategy-card">
                                        <div className="strategy-card__content">
                                            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                                            <p className="mt-2 text-sm leading-7 text-gray-400">{item.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
                <section className="max-w-7xl mx-auto px-4 py-20">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl font-bold">SOLUCIONES DIGITALES QUE <span className="gradient-text">TRABAJAN POR TI</span></h2>
                        <p className="mt-4 text-gray-400 max-w-2xl mx-auto">Todo lo que tu negocio necesita para crecer en línea, en un solo lugar.</p>
                    </div>

                    <div className="tabs">
                        <div className="mb-10 flex items-center justify-center gap-4">
                            <span className="font-mono text-xs tracking-[0.3em] text-gray-500">
                                0{activeServiceIndex + 1}
                            </span>
                            <div className="relative h-1 w-40 overflow-hidden rounded-full bg-white/10 sm:w-56">
                                <div
                                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-nexus-blue to-nexus-purple transition-all duration-500 ease-out"
                                    style={{ width: `${((activeServiceIndex + 1) / services.length) * 100}%` }}
                                />
                            </div>
                            <span className="font-mono text-xs tracking-[0.3em] text-gray-500">
                                0{services.length}
                            </span>
                        </div>

                        <div className="tabs__content relative">
                            <button
                                type="button"
                                onClick={goToPrevService}
                                disabled={activeServiceIndex === 0}
                                aria-label="Servicio anterior"
                                className="group absolute left-0 top-1/2 z-10 -translate-y-1/2 -translate-x-1/2 sm:-translate-x-1/3 disabled:cursor-not-allowed disabled:opacity-20"
                            >
                                <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-nexus-dark/90 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-300 group-hover:border-transparent group-hover:shadow-[0_0_25px_rgba(0,184,255,0.45)] group-active:scale-90 sm:h-14 sm:w-14">
                                    <span className="absolute inset-0 rounded-full bg-gradient-to-br from-nexus-blue to-nexus-purple opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                    <svg viewBox="0 0 24 24" fill="none" className="relative h-5 w-5 text-white transition-transform duration-300 group-hover:-translate-x-0.5 sm:h-6 sm:w-6">
                                        <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                                    </svg>
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={goToNextService}
                                disabled={activeServiceIndex === services.length - 1}
                                aria-label="Siguiente servicio"
                                className="group absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-1/2 sm:translate-x-1/3 disabled:cursor-not-allowed disabled:opacity-20"
                            >
                                <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-nexus-dark/90 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-300 group-hover:border-transparent group-hover:shadow-[0_0_25px_rgba(0,184,255,0.45)] group-active:scale-90 sm:h-14 sm:w-14">
                                    <span className="absolute inset-0 rounded-full bg-gradient-to-br from-nexus-blue to-nexus-purple opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                    <svg viewBox="0 0 24 24" fill="none" className="relative h-5 w-5 text-white transition-transform duration-300 group-hover:translate-x-0.5 sm:h-6 sm:w-6">
                                        <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                                    </svg>
                                </span>
                            </button>

                            {services.map((service, index) => (
                                <div
                                    key={service.id}
                                    className={`tab-pane ${index === activeServiceIndex ? 'tab-pane--active' : ''}`}
                                >
                                    <div className="grid gap-10 lg:grid-cols-2 items-center rounded-3xl border border-white/10 bg-white/5 p-6 md:p-10">
                                        <div>
                                            <div className={service.badgeClasses}>
                                                <i className={service.icon}></i>
                                            </div>
                                            <h3 className="text-2xl font-bold text-white mt-6 mb-4">{service.title}</h3>
                                            <p className="text-gray-400 leading-relaxed mb-8">{service.details}</p>
                                            <ul className="space-y-4">
                                                {service.features.map((feature) => (
                                                    <li key={feature} className="flex items-center gap-3 text-sm text-gray-300">
                                                        <span className="h-2 w-2 rounded-sm bg-gradient-to-r from-nexus-blue to-nexus-purple flex-shrink-0"></span>
                                                        <span>{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="relative rounded-3xl overflow-hidden aspect-[3/2] border border-white/10">
                                            <img
                                                src={service.imageSrc}
                                                alt={service.imageAlt}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
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




