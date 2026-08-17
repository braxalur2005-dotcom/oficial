import { useState, useEffect, useMemo } from 'react';
import { supabaseClient } from '../utils/supabaseClient.js';

const PACKAGE_OPTIONS = ['Gratis', 'Paquete Esencial', 'Paquete Profesional', 'Paquete Personalizado'];

function downloadCsv(filename, rows, headers) {
    const escape = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;
    const lines = [headers.map(escape).join(',')];
    rows.forEach((row) => {
        lines.push(headers.map((h) => escape(row[h])).join(','));
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function RevenueChart({ purchasesList }) {
    const monthlyData = useMemo(() => {
        const buckets = {};
        purchasesList.forEach((p) => {
            const date = p.objectData.date ? new Date(p.objectData.date) : null;
            if (!date) return;
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            buckets[key] = (buckets[key] || 0) + (Number(p.objectData.amount) || 0);
        });
        const sortedKeys = Object.keys(buckets).sort().slice(-6);
        return sortedKeys.map((key) => {
            const [year, month] = key.split('-');
            const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            return { label: `${monthNames[Number(month) - 1]} ${year.slice(2)}`, value: buckets[key] };
        });
    }, [purchasesList]);

    const maxValue = Math.max(1, ...monthlyData.map((d) => d.value));

    if (monthlyData.length === 0) {
        return <p className="text-gray-500 text-center py-8">Todavía no hay suficientes datos para mostrar la gráfica.</p>;
    }

    return (
        <div className="flex items-end gap-4 h-48 pt-4">
            {monthlyData.map((d) => (
                <div key={d.label} className="flex-1 flex flex-col items-center justify-end h-full gap-2">
                    <span className="text-xs text-gray-300 font-semibold">${d.value.toLocaleString('es-MX')}</span>
                    <div
                        className="w-full max-w-[48px] rounded-t-lg bg-gradient-to-t from-nexus-accent to-nexus-purple transition-all duration-500"
                        style={{ height: `${Math.max(6, (d.value / maxValue) * 100)}%` }}
                    ></div>
                    <span className="text-xs text-gray-500">{d.label}</span>
                </div>
            ))}
        </div>
    );
}

export default function AdminDashboard({ user, onLogout, onViewSite }) {
    const [currentTab, setCurrentTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [usersList, setUsersList] = useState([]);
    const [purchasesList, setPurchasesList] = useState([]);
    const [leadsList, setLeadsList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [userSearch, setUserSearch] = useState('');
    const [purchaseSearch, setPurchaseSearch] = useState('');
    const [savingUserId, setSavingUserId] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        setLoadError('');
        try {
            const supabase = supabaseClient;
            const [usersRes, purchasesRes, leadsRes] = await Promise.all([
                supabase.from('nexus_users').select('*').order('created_at', { ascending: false }),
                supabase.from('nexus_purchases').select('*').order('created_at', { ascending: false }),
                supabase.from('nexus_leads').select('*').order('created_at', { ascending: false })
            ]);
            if (usersRes.error) throw usersRes.error;
            if (purchasesRes.error) throw purchasesRes.error;

            setUsersList((usersRes.data || []).map((row) => ({
                objectId: row.id,
                objectData: {
                    name: row.name,
                    email: row.email,
                    activePackage: row.active_package || 'Gratis',
                    createdAt: row.created_at
                }
            })));

            setPurchasesList((purchasesRes.data || []).map((row) => ({
                objectId: row.id,
                objectData: {
                    date: row.created_at,
                    userId: row.user_id,
                    packageId: row.package_name || row.package_id,
                    paymentMethod: row.payment_method,
                    amount: row.amount
                }
            })));

            if (!leadsRes.error) {
                setLeadsList((leadsRes.data || []).map((row) => ({
                    objectId: row.id,
                    objectData: {
                        nombre: row.nombre,
                        correo: row.correo,
                        duda: row.duda,
                        createdAt: row.created_at
                    }
                })));
            }
        } catch (error) {
            console.error('Error loading admin data:', error);
            setLoadError('No se pudo cargar la información. Es posible que tu cuenta no tenga permisos de administrador configurados en Supabase.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePackageChange = async (userId, newPackage) => {
        setSavingUserId(userId);
        try {
            const { error } = await supabaseClient
                .from('nexus_users')
                .update({ active_package: newPackage, updated_at: new Date().toISOString() })
                .eq('id', userId);
            if (error) throw error;
            setUsersList((prev) => prev.map((u) => u.objectId === userId ? { ...u, objectData: { ...u.objectData, activePackage: newPackage } } : u));
        } catch (error) {
            console.error('Error updating package:', error);
            alert('No se pudo actualizar el paquete. Verifica los permisos de tu cuenta en Supabase.');
        } finally {
            setSavingUserId(null);
        }
    };

    const totalUsers = usersList.length;
    const totalPurchases = purchasesList.length;
    const totalRevenue = purchasesList.reduce((sum, p) => sum + (Number(p.objectData.amount) || 0), 0);
    const totalMessages = leadsList.length;

    const filteredUsers = useMemo(() => {
        const term = userSearch.trim().toLowerCase();
        if (!term) return usersList;
        return usersList.filter((u) =>
            (u.objectData.name || '').toLowerCase().includes(term) ||
            (u.objectData.email || '').toLowerCase().includes(term) ||
            (u.objectData.activePackage || '').toLowerCase().includes(term)
        );
    }, [usersList, userSearch]);

    const filteredPurchases = useMemo(() => {
        const term = purchaseSearch.trim().toLowerCase();
        if (!term) return purchasesList;
        return purchasesList.filter((p) =>
            (p.objectData.packageId || '').toLowerCase().includes(term) ||
            (p.objectData.userId || '').toLowerCase().includes(term) ||
            (p.objectData.paymentMethod || '').toLowerCase().includes(term)
        );
    }, [purchasesList, purchaseSearch]);

    const exportUsersCsv = () => {
        downloadCsv(
            'usuarios-nexus.csv',
            usersList.map((u) => ({
                nombre: u.objectData.name,
                email: u.objectData.email,
                paquete: u.objectData.activePackage,
                registrado: u.objectData.createdAt ? new Date(u.objectData.createdAt).toLocaleDateString() : ''
            })),
            ['nombre', 'email', 'paquete', 'registrado']
        );
    };

    const exportPurchasesCsv = () => {
        downloadCsv(
            'compras-nexus.csv',
            purchasesList.map((p) => ({
                fecha: p.objectData.date ? new Date(p.objectData.date).toLocaleDateString() : '',
                usuario_id: p.objectData.userId,
                paquete: p.objectData.packageId,
                metodo: p.objectData.paymentMethod,
                monto: p.objectData.amount
            })),
            ['fecha', 'usuario_id', 'paquete', 'metodo', 'monto']
        );
    };

    const navItems = [
        { id: 'dashboard', icon: 'icon-layout-dashboard', label: 'Panel General' },
        { id: 'users', icon: 'icon-users', label: 'Usuarios' },
        { id: 'messages', icon: 'icon-mail', label: 'Mensajes', badge: totalMessages },
    ];

    const goToTab = (tabId) => {
        setCurrentTab(tabId);
        setIsSidebarOpen(false);
    };

    const renderTabContent = () => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center h-64">
                    <div className="icon-loader animate-spin text-4xl text-nexus-accent"></div>
                </div>
            );
        }

        if (loadError) {
            return (
                <div className="glass-panel p-8 text-center">
                    <p className="text-red-400">{loadError}</p>
                </div>
            );
        }

        if (currentTab === 'dashboard') {
            return (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="glass-panel p-6">
                            <h3 className="text-gray-400 text-sm mb-1">Total Usuarios</h3>
                            <p className="text-3xl font-bold text-nexus-blue">{totalUsers}</p>
                        </div>
                        <div className="glass-panel p-6">
                            <h3 className="text-gray-400 text-sm mb-1">Total Compras</h3>
                            <p className="text-3xl font-bold text-nexus-purple">{totalPurchases}</p>
                        </div>
                        <div className="glass-panel p-6">
                            <h3 className="text-gray-400 text-sm mb-1">Ingresos Totales</h3>
                            <p className="text-3xl font-bold text-nexus-pink">${totalRevenue.toLocaleString('es-MX')}</p>
                        </div>
                        <div className="glass-panel p-6">
                            <h3 className="text-gray-400 text-sm mb-1">Mensajes Nuevos</h3>
                            <p className="text-3xl font-bold text-nexus-accent">{totalMessages}</p>
                        </div>
                    </div>

                    <div className="mt-8 glass-panel p-8">
                        <h3 className="text-xl font-bold mb-2">Ingresos por Mes</h3>
                        <RevenueChart purchasesList={purchasesList} />
                    </div>

                    <div className="mt-8 glass-panel p-8">
                        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                            <h3 className="text-xl font-bold">Actividad Reciente de Compras</h3>
                            {purchasesList.length > 0 && (
                                <button onClick={exportPurchasesCsv} className="btn-secondary py-2 text-sm flex items-center">
                                    <div className="icon-download mr-2"></div> Exportar CSV
                                </button>
                            )}
                        </div>
                        {purchasesList.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/10 text-gray-400 text-sm">
                                            <th className="pb-3 px-4">Fecha</th>
                                            <th className="pb-3 px-4">Usuario ID</th>
                                            <th className="pb-3 px-4">Paquete</th>
                                            <th className="pb-3 px-4">Método</th>
                                            <th className="pb-3 px-4">Monto</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {purchasesList.slice(0, 8).map((p, i) => (
                                            <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                                                <td className="py-3 px-4 text-sm text-gray-300">{p.objectData.date ? new Date(p.objectData.date).toLocaleDateString() : '-'}</td>
                                                <td className="py-3 px-4 text-sm text-gray-300 truncate max-w-xs">{p.objectData.userId}</td>
                                                <td className="py-3 px-4 text-sm font-semibold text-nexus-accent">{p.objectData.packageId}</td>
                                                <td className="py-3 px-4 text-sm text-gray-300">{p.objectData.paymentMethod}</td>
                                                <td className="py-3 px-4 text-sm text-green-400 font-bold">${p.objectData.amount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">No hay compras registradas aún.</p>
                        )}
                    </div>
                </>
            );
        }

        if (currentTab === 'users') {
            return (
                <div className="glass-panel p-8">
                    <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
                        <h3 className="text-xl font-bold">Gestión de Usuarios</h3>
                        <div className="flex flex-wrap gap-3">
                            <button onClick={exportUsersCsv} className="btn-secondary py-2 text-sm flex items-center">
                                <div className="icon-download mr-2"></div> Exportar CSV
                            </button>
                            <button onClick={loadData} className="btn-secondary py-2 text-sm flex items-center">
                                <div className="icon-refresh-cw mr-2"></div> Actualizar
                            </button>
                        </div>
                    </div>
                    <input
                        type="text"
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        placeholder="Buscar por nombre, email o paquete..."
                        className="w-full bg-nexus-dark/50 border border-white/20 rounded-lg px-4 py-3 text-white mb-6 focus:outline-none focus:border-nexus-accent"
                    />
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-gray-400 text-sm">
                                    <th className="pb-3 px-4">Nombre</th>
                                    <th className="pb-3 px-4">Email</th>
                                    <th className="pb-3 px-4">Paquete Activo</th>
                                    <th className="pb-3 px-4">Registrado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.slice(0, 50).map((u, i) => (
                                    <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                                        <td className="py-3 px-4 text-sm font-medium text-white">{u.objectData.name}</td>
                                        <td className="py-3 px-4 text-sm text-gray-300">{u.objectData.email}</td>
                                        <td className="py-3 px-4 text-sm">
                                            <select
                                                value={u.objectData.activePackage}
                                                disabled={savingUserId === u.objectId}
                                                onChange={(e) => handlePackageChange(u.objectId, e.target.value)}
                                                className="bg-nexus-purple/20 text-nexus-purple border border-nexus-purple/30 rounded-full text-xs font-semibold px-2 py-1 focus:outline-none disabled:opacity-50"
                                            >
                                                {PACKAGE_OPTIONS.map((opt) => (
                                                    <option key={opt} value={opt} className="bg-nexus-dark text-white">{opt}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-400">
                                            {u.objectData.createdAt ? new Date(u.objectData.createdAt).toLocaleDateString() : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredUsers.length === 0 && (
                            <p className="text-gray-500 text-center py-6">No se encontraron usuarios con esa búsqueda.</p>
                        )}
                        {filteredUsers.length > 50 && (
                            <p className="text-gray-500 text-sm text-center pt-4">Mostrando los primeros 50 de {filteredUsers.length} resultados. Usa el buscador para acotar.</p>
                        )}
                    </div>
                </div>
            );
        }

        if (currentTab === 'messages') {
            return (
                <div className="glass-panel p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">Mensajes de Contacto</h3>
                        <button onClick={loadData} className="btn-secondary py-2 text-sm flex items-center">
                            <div className="icon-refresh-cw mr-2"></div> Actualizar
                        </button>
                    </div>
                    {leadsList.length > 0 ? (
                        <div className="space-y-4">
                            {leadsList.map((lead, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5">
                                    <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                                        <div>
                                            <p className="font-semibold text-white">{lead.objectData.nombre || 'Sin nombre'}</p>
                                            <p className="text-sm text-nexus-accent">{lead.objectData.correo}</p>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            {lead.objectData.createdAt ? new Date(lead.objectData.createdAt).toLocaleString() : ''}
                                        </p>
                                    </div>
                                    <p className="text-sm text-gray-300 leading-relaxed">{lead.objectData.duda}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">No hay mensajes de contacto registrados aún.</p>
                    )}
                </div>
            );
        }
    };

    return (
        <div className="min-h-screen bg-nexus-dark text-white flex">
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-10 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            <aside className={`w-64 bg-white/5 border-r border-white/10 flex flex-col fixed h-full z-20 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center">
                        <img src="img/Logo_Nexus_Recolor_Transparente.png" alt="Nexus" width="32" height="32" className="h-8" />
                        <span className="ml-2 text-xl font-heading font-black tracking-widest text-nexus-accent">ADMIN</span>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white" aria-label="Cerrar menú">
                        <div className="icon-x text-xl"></div>
                    </button>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => goToTab(item.id)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition ${currentTab === item.id ? 'bg-nexus-accent/20 text-nexus-accent' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <span className="flex items-center space-x-3">
                                <div className={item.icon}></div>
                                <span>{item.label}</span>
                            </span>
                            {!!item.badge && (
                                <span className="bg-nexus-pink text-white text-xs font-bold rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center">
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-white/10">
                    <p className="text-xs text-gray-500 mb-3 truncate">{user?.objectData?.email}</p>
                    <button onClick={onLogout} className="w-full flex items-center justify-center space-x-2 text-red-400 hover:text-red-300 bg-red-400/10 hover:bg-red-400/20 px-4 py-3 rounded-lg transition">
                        <div className="icon-log-out"></div>
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 lg:ml-64 p-4 sm:p-8 min-h-screen">
                <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-6 gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-gray-300 hover:text-white flex-shrink-0" aria-label="Abrir menú">
                            <div className="icon-menu text-2xl"></div>
                        </button>
                        <div className="min-w-0">
                            <h1 className="text-2xl sm:text-3xl font-bold truncate">Panel de Control</h1>
                            <p className="text-gray-400 text-sm hidden sm:block">Gestiona usuarios y revisa los ingresos de Nexus.</p>
                        </div>
                    </div>
                    <button onClick={onViewSite} className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-3 sm:px-4 py-2 rounded-lg transition text-sm flex-shrink-0">
                        <div className="icon-globe"></div>
                        <span className="hidden sm:inline">Ver página principal</span>
                    </button>
                </header>

                {renderTabContent()}
            </main>
        </div>
    );
}

