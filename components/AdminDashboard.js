function AdminDashboard({ user, onLogout }) {
    const [currentTab, setCurrentTab] = useState('dashboard');
    const [usersList, setUsersList] = useState([]);
    const [purchasesList, setPurchasesList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [usersData, purchasesData] = await Promise.all([
                trickleListObjects('nexus_user', 100, true),
                trickleListObjects('nexus_purchase', 100, true)
            ]);
            setUsersList(usersData.items || []);
            setPurchasesList(purchasesData.items || []);
        } catch (error) {
            console.error("Error loading admin data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate stats
    const totalUsers = usersList.length;
    const totalPurchases = purchasesList.length;
    const totalRevenue = purchasesList.reduce((sum, p) => sum + (p.objectData.amount || 0), 0);
    const allProjects = usersList.flatMap(u => u.objectData.projects || []);

    const renderTabContent = () => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center h-64">
                    <div className="icon-loader animate-spin text-4xl text-nexus-accent"></div>
                </div>
            );
        }

        if (currentTab === 'dashboard') {
            return (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                            <p className="text-3xl font-bold text-nexus-pink">${totalRevenue}</p>
                        </div>
                        <div className="glass-panel p-6">
                            <h3 className="text-gray-400 text-sm mb-1">Páginas Solicitadas</h3>
                            <p className="text-3xl font-bold text-green-400">{allProjects.length}</p>
                        </div>
                    </div>
                    
                    <div className="mt-8 glass-panel p-8">
                        <h3 className="text-xl font-bold mb-4">Actividad Reciente de Compras</h3>
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
                                        {purchasesList.slice(0, 5).map((p, i) => (
                                            <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                                                <td className="py-3 px-4 text-sm text-gray-300">{new Date(p.objectData.date).toLocaleDateString()}</td>
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
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">Gestión de Usuarios</h3>
                        <button onClick={loadData} className="btn-secondary py-2 text-sm flex items-center">
                            <div className="icon-refresh-cw mr-2"></div> Actualizar
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-gray-400 text-sm">
                                    <th className="pb-3 px-4">Nombre</th>
                                    <th className="pb-3 px-4">Email</th>
                                    <th className="pb-3 px-4">Paquete Activo</th>
                                    <th className="pb-3 px-4">Proyectos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usersList.map((u, i) => (
                                    <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                                        <td className="py-3 px-4 text-sm font-medium text-white">{u.objectData.name}</td>
                                        <td className="py-3 px-4 text-sm text-gray-300">{u.objectData.email}</td>
                                        <td className="py-3 px-4 text-sm">
                                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-nexus-purple/20 text-nexus-purple border border-nexus-purple/30">
                                                {u.objectData.activePackage}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-300">
                                            {u.objectData.projects ? u.objectData.projects.length : 0}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }

        if (currentTab === 'projects') {
            return (
                <div className="glass-panel p-8">
                    <h3 className="text-xl font-bold mb-6">Solicitudes de Proyectos</h3>
                    {allProjects.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                            {allProjects.map((proj, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center">
                                    <div>
                                        <h4 className="font-bold text-lg text-nexus-pink">{proj.name}</h4>
                                        <p className="text-sm text-gray-400 mt-1 line-clamp-2 max-w-2xl">{proj.prompt}</p>
                                    </div>
                                    <div className="mt-4 md:mt-0 flex items-center space-x-3">
                                        <span className="px-3 py-1 rounded-lg text-sm bg-nexus-blue/20 text-nexus-blue border border-nexus-blue/30 font-semibold">
                                            {proj.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8 border border-dashed border-white/10 rounded-xl">No hay proyectos solicitados en este momento.</p>
                    )}
                </div>
            );
        }
    };

    return (
        <div className="min-h-screen bg-nexus-dark text-white flex">
            {/* Sidebar Admin */}
            <aside className="w-64 bg-white/5 border-r border-white/10 flex flex-col fixed h-full z-10">
                <div className="p-6 border-b border-white/10 flex items-center">
                    <div className="icon-triangle text-2xl text-nexus-accent"></div>
                    <span className="ml-2 text-xl font-heading font-black tracking-widest text-nexus-accent">ADMIN</span>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <button 
                        onClick={() => setCurrentTab('dashboard')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition ${currentTab === 'dashboard' ? 'bg-nexus-accent/20 text-nexus-accent' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <div className="icon-layout-dashboard"></div>
                        <span>Panel General</span>
                    </button>
                    <button 
                        onClick={() => setCurrentTab('users')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition ${currentTab === 'users' ? 'bg-nexus-accent/20 text-nexus-accent' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <div className="icon-users"></div>
                        <span>Usuarios</span>
                    </button>
                    <button 
                        onClick={() => setCurrentTab('projects')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition ${currentTab === 'projects' ? 'bg-nexus-accent/20 text-nexus-accent' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <div className="icon-folder-open"></div>
                        <span>Proyectos Activos</span>
                    </button>
                </nav>
                <div className="p-4 border-t border-white/10">
                    <button onClick={onLogout} className="w-full flex items-center justify-center space-x-2 text-red-400 hover:text-red-300 bg-red-400/10 hover:bg-red-400/20 px-4 py-3 rounded-lg transition">
                        <div className="icon-log-out"></div>
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Admin */}
            <main className="flex-1 ml-64 p-8 min-h-screen">
                <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold">Panel de Control</h1>
                        <p className="text-gray-400">Gestiona usuarios, revisa ingresos y monitorea las solicitudes de páginas.</p>
                    </div>
                </header>

                {renderTabContent()}
            </main>
        </div>
    );
}
