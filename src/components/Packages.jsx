import { useState } from 'react';
import { createPurchase } from '../utils/db.js';

export default function Packages({ user, setShowAuth, onPurchaseSuccess }) {
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('tarjeta');
    const [isProcessing, setIsProcessing] = useState(false);

    const [maintenance1, setMaintenance1] = useState(false);
    const [selectedTools, setSelectedTools] = useState([]);
    const [maintenance2, setMaintenance2] = useState(false);

    const TOOLS = [
        { id: 'cotizador', name: 'Cotizador Inteligente' },
        { id: 'rastreador', name: 'Rastreador de Órdenes en Tiempo Real' },
        { id: 'ubicacion', name: 'Ubicación Digital Estratégica' },
        { id: 'seo', name: 'SEO Orgánico' },
        { id: 'automatizacion', name: 'Automatización' }
    ];

    const PKG1_PRICE = 10000;
    const PKG1_MAINTENANCE = 1000;
    const PKG2_TOOL_PRICE = 3000;
    const PKG2_TOOL_MAINTENANCE = 300;

    const pkg1Monthly = maintenance1 ? PKG1_MAINTENANCE : 0;

    const pkg2OneTime = selectedTools.length * PKG2_TOOL_PRICE;
    const pkg2Monthly = maintenance2 ? selectedTools.length * PKG2_TOOL_MAINTENANCE : 0;

    const toggleTool = (toolId) => {
        setSelectedTools((prev) =>
            prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]
        );
    };

    const handleAcquirePackage1 = () => {
        if (!user) {
            setShowAuth(true);
            return;
        }
        setSelectedPackage({
            id: 'todo-incluido',
            name: 'Todo Incluido',
            price: PKG1_PRICE,
            monthly: pkg1Monthly,
            features: [
                'Cotizador Inteligente',
                'Rastreador de Órdenes en Tiempo Real',
                'Ubicación Digital Estratégica',
                'SEO Orgánico',
                'Automatización',
                'Desarrollo a Medida (de regalo)',
                'Diseño Responsivo (de regalo)',
                'Alto Rendimiento (de regalo)',
                'Accesibilidad (de regalo)'
            ]
        });
        setShowPaymentModal(true);
    };

    const handleAcquirePackage2 = () => {
        if (!user) {
            setShowAuth(true);
            return;
        }
        if (selectedTools.length === 0) {
            alert('Selecciona al menos una herramienta para armar tu paquete.');
            return;
        }
        const toolNames = TOOLS.filter((t) => selectedTools.includes(t.id)).map((t) => t.name);
        setSelectedPackage({
            id: 'arma-tu-paquete',
            name: 'Arma tu Paquete',
            price: pkg2OneTime,
            monthly: pkg2Monthly,
            features: toolNames
        });
        setShowPaymentModal(true);
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));

            await createPurchase({
                userId: user.objectId,
                packageId: selectedPackage.id,
                packageName: selectedPackage.name,
                amount: selectedPackage.price,
                paymentMethod: paymentMethod
            });

            onPurchaseSuccess(selectedPackage);
            setShowPaymentModal(false);

            console.log(`Email enviado a ${user.objectData.email}: ¡Gracias por su compra!`);
            console.log(`Email enviado a empresa: Nueva compra del paquete ${selectedPackage.name} por ${user.objectData.name}`);

            alert('¡Pago exitoso! Hemos enviado un correo con los detalles de tu compra.');
        } catch (error) {
            console.error('Payment error:', error);
            alert('Hubo un error al procesar el pago. Inténtalo de nuevo.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">Nuestros <span className="gradient-text">Paquetes</span></h2>
                <p className="text-gray-400 max-w-2xl mx-auto">Elige la forma en la que quieres impulsar tu negocio de reparación.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* PAQUETE 1 — TODO INCLUIDO */}
                <div className="glass-panel p-8 relative flex flex-col" style={{ border: '2px solid #10e28a', borderRadius: '1rem' }}>
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-nexus-blue to-nexus-purple text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl rounded-tr-xl shadow-lg">
                        TODO INCLUIDO
                    </div>
                    <h3 className="text-2xl font-bold mb-2 relative z-10">Paquete 1 — Todo Incluido</h3>
                    <p className="text-gray-400 mb-6 relative z-10">
                        Todo lo que tu negocio de reparación necesita para vender más, en un solo paquete.
                    </p>

                    <div className="mb-6 relative z-10">
                        <span className="text-4xl font-bold">${PKG1_PRICE.toLocaleString('es-MX')} MXN</span>
                        <span className="text-gray-400"> pago único</span>
                    </div>

                    <p className="text-sm text-gray-400 mb-4 relative z-10">Este paquete incluye:</p>
                    <ul className="space-y-3 mb-4 relative z-10">
                        {['Cotizador Inteligente', 'Rastreador de Órdenes en Tiempo Real', 'Ubicación Digital Estratégica', 'SEO Orgánico', 'Automatización'].map((feature) => (
                            <li key={feature} className="flex items-center text-sm text-gray-300">
                                <div className="icon-circle-check text-nexus-accent mr-3"></div>
                                {feature}
                            </li>
                        ))}
                    </ul>

                    <p className="text-sm text-nexus-accent mb-4 relative z-10">De regalo, sin costo extra:</p>
                    <ul className="space-y-3 mb-6 relative z-10">
                        {['Desarrollo a Medida', 'Diseño Responsivo', 'Alto Rendimiento', 'Accesibilidad'].map((feature) => (
                            <li key={feature} className="flex items-center text-sm text-gray-300">
                                <div className="icon-gift text-nexus-glow mr-3"></div>
                                {feature}
                            </li>
                        ))}
                    </ul>

                    <label className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer relative z-10">
                        <input
                            type="checkbox"
                            checked={maintenance1}
                            onChange={(e) => setMaintenance1(e.target.checked)}
                            className="w-5 h-5 accent-nexus-accent"
                        />
                        <span className="text-sm text-gray-200">
                            Incluir mantenimiento mensual (+${PKG1_MAINTENANCE.toLocaleString('es-MX')} MXN/mes)
                        </span>
                    </label>

                    {maintenance1 && (
                        <p className="text-sm text-nexus-glow mb-4 relative z-10">
                            Total: ${PKG1_PRICE.toLocaleString('es-MX')} MXN único + ${PKG1_MAINTENANCE.toLocaleString('es-MX')} MXN/mes
                        </p>
                    )}

                    <button onClick={handleAcquirePackage1} className="btn-primary w-full mt-auto relative z-10">
                        Solicitar Todo Incluido
                    </button>
                </div>

                {/* PAQUETE 2 — ARMA TU PAQUETE */}
                <div className="glass-panel p-8 relative flex flex-col" style={{ border: '2px solid #10e28a', borderRadius: '1rem' }}>
                    <h3 className="text-2xl font-bold mb-2 relative z-10">Paquete 2 — Arma tu Paquete</h3>
                    <p className="text-gray-400 mb-6 relative z-10">
                        ¿Ya tienes página web? Elige solo las herramientas que necesitas.
                    </p>

                    <div className="mb-6 relative z-10">
                        <span className="text-4xl font-bold">${PKG2_TOOL_PRICE.toLocaleString('es-MX')} MXN</span>
                        <span className="text-gray-400"> por herramienta, pago único</span>
                    </div>

                    <p className="text-sm text-gray-400 mb-4 relative z-10">Elige entre:</p>
                    <div className="space-y-3 mb-6 relative z-10">
                        {TOOLS.map((tool) => (
                            <label
                                key={tool.id}
                                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:border-nexus-accent/50 transition-colors"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedTools.includes(tool.id)}
                                    onChange={() => toggleTool(tool.id)}
                                    className="w-5 h-5 accent-nexus-accent"
                                />
                                <span className="text-sm text-gray-200">{tool.name}</span>
                            </label>
                        ))}
                    </div>

                    <label className="flex items-center gap-3 mb-4 p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer relative z-10">
                        <input
                            type="checkbox"
                            checked={maintenance2}
                            onChange={(e) => setMaintenance2(e.target.checked)}
                            className="w-5 h-5 accent-nexus-accent"
                        />
                        <span className="text-sm text-gray-200">
                            Incluir mantenimiento mensual (+${PKG2_TOOL_MAINTENANCE.toLocaleString('es-MX')} MXN/mes por herramienta)
                        </span>
                    </label>

                    <div className="mb-6 relative z-10 p-4 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-sm text-gray-400">
                            {selectedTools.length === 0
                                ? 'Selecciona al menos una herramienta.'
                                : `${selectedTools.length} herramienta${selectedTools.length > 1 ? 's' : ''} seleccionada${selectedTools.length > 1 ? 's' : ''}`}
                        </p>
                        <p className="text-lg font-bold mt-1">
                            ${pkg2OneTime.toLocaleString('es-MX')} MXN
                            {pkg2Monthly > 0 && <span className="text-nexus-glow"> + ${pkg2Monthly.toLocaleString('es-MX')} MXN/mes</span>}
                        </p>
                    </div>

                    <button
                        onClick={handleAcquirePackage2}
                        disabled={selectedTools.length === 0}
                        className="btn-secondary w-full mt-auto relative z-10 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Armar mi Paquete
                    </button>
                </div>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && selectedPackage && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="glass-panel w-full max-w-md p-8 relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setShowPaymentModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                            disabled={isProcessing}
                        >
                            <div className="icon-x text-2xl"></div>
                        </button>

                        <h2 className="text-2xl font-bold mb-6">Completar Compra</h2>
                        <div className="bg-white/5 p-4 rounded-xl mb-6">
                            <p className="text-sm text-gray-400">Paquete seleccionado:</p>
                            <p className="text-xl font-semibold text-nexus-accent">{selectedPackage.name}</p>
                            <ul className="mt-3 space-y-1">
                                {selectedPackage.features.map((feature) => (
                                    <li key={feature} className="text-sm text-gray-300 flex items-center">
                                        <div className="icon-circle-check text-nexus-accent mr-2 text-sm"></div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <p className="text-lg font-bold mt-4">Total: ${selectedPackage.price.toLocaleString('es-MX')} MXN</p>
                            {selectedPackage.monthly > 0 && (
                                <p className="text-sm text-nexus-glow">+ ${selectedPackage.monthly.toLocaleString('es-MX')} MXN/mes de mantenimiento</p>
                            )}
                        </div>

                        <form onSubmit={handlePaymentSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Método de Pago</label>
                                <select
                                    className="w-full bg-nexus-dark/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-nexus-accent focus:shadow-[0_0_15px_rgba(0,184,255,0.3)] transition-all"
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    disabled={isProcessing}
                                >
                                    <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                                    <option value="paypal">PayPal</option>
                                    <option value="transferencia">Transferencia Bancaria</option>
                                </select>
                            </div>

                            {paymentMethod === 'tarjeta' && (
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Número de tarjeta"
                                        required
                                        className="w-full bg-nexus-dark/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-nexus-accent"
                                        disabled={isProcessing}
                                    />
                                    <div className="flex space-x-4">
                                        <input
                                            type="text"
                                            placeholder="MM/AA"
                                            required
                                            className="w-1/2 bg-nexus-dark/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-nexus-accent"
                                            disabled={isProcessing}
                                        />
                                        <input
                                            type="text"
                                            placeholder="CVC"
                                            required
                                            className="w-1/2 bg-nexus-dark/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-nexus-accent"
                                            disabled={isProcessing}
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Nombre en la tarjeta"
                                        required
                                        className="w-full bg-nexus-dark/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-nexus-accent"
                                        disabled={isProcessing}
                                    />
                                </div>
                            )}

                            {paymentMethod === 'paypal' && (
                                <p className="text-sm text-gray-400 p-4 text-center">Serás redirigido a PayPal para completar tu pago de forma segura.</p>
                            )}

                            <button
                                type="submit"
                                disabled={isProcessing}
                                className="btn-primary w-full mt-6 flex justify-center items-center"
                            >
                                {isProcessing ? (
                                    <span className="flex items-center">
                                        <div className="icon-loader animate-spin mr-2"></div>
                                        Procesando...
                                    </span>
                                ) : (
                                    `Pagar $${selectedPackage.price.toLocaleString('es-MX')} MXN`
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
