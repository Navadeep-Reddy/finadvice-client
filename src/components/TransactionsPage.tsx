import Sidebar from './Sidebar';

const TransactionsPage = () => {
    return (
        <div className="relative flex min-h-screen w-full flex-row overflow-hidden bg-background-light text-walnut font-display selection:bg-olive selection:text-white bg-grid">
            <Sidebar />
            <main className="flex-1 h-full overflow-y-auto relative p-6 lg:p-12 lg:pl-0 z-10">
                <div className="max-w-7xl mx-auto flex flex-col h-full">
                    <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                        <div>
                            <h1 className="text-4xl font-bold text-walnut tracking-tight mb-2">Transaction Ledger</h1>
                            <p className="text-walnut/60 text-lg">Detailed history of institutional capital movements.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="glass-panel px-4 py-2.5 rounded-xl text-walnut text-sm font-bold hover:bg-white/60 transition-all flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">download</span>
                                Export CSV
                            </button>
                            <button className="btn-liquid px-6 py-2.5 rounded-xl text-white text-sm font-bold shadow-lg flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">add</span>
                                New Transfer
                            </button>
                        </div>
                    </header>
                    <section className="glass-panel p-5 rounded-2xl mb-8 border border-white/60 shadow-glass">
                        <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                            <div className="flex-1 min-w-[200px] relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-walnut/40">search</span>
                                <input className="w-full pl-10 pr-4 py-2.5 rounded-lg input-glass text-walnut placeholder-walnut/40 text-sm font-medium focus:ring-0" placeholder="Search by ID, counterparty..." type="text" />
                            </div>
                            <div className="hidden lg:block w-px h-8 bg-walnut/10"></div>
                            <div className="flex flex-wrap gap-4 items-center">
                                <div className="relative">
                                    <label className="block text-xs font-bold text-walnut/50 uppercase tracking-wider mb-1.5 ml-1">Period</label>
                                    <div className="flex items-center gap-2">
                                        <input className="px-3 py-2 rounded-lg input-glass text-walnut text-sm font-medium focus:ring-0 w-36 cursor-pointer" type="date" defaultValue="2023-10-01" />
                                        <span className="text-walnut/40">-</span>
                                        <input className="px-3 py-2 rounded-lg input-glass text-walnut text-sm font-medium focus:ring-0 w-36 cursor-pointer" type="date" defaultValue="2023-10-31" />
                                    </div>
                                </div>
                                <div className="relative">
                                    <label className="block text-xs font-bold text-walnut/50 uppercase tracking-wider mb-1.5 ml-1">Type</label>
                                    <div className="relative">
                                        <select className="px-3 py-2 rounded-lg input-glass text-walnut text-sm font-medium focus:ring-0 w-40 cursor-pointer appearance-none pr-8">
                                            <option>All Transactions</option>
                                            <option>Settlements</option>
                                            <option>Equity Block</option>
                                            <option>FX Spot</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-walnut/50 pointer-events-none text-lg">expand_more</span>
                                    </div>
                                </div>
                                <div className="relative pt-6">
                                    <button className="px-3 py-2 rounded-lg input-glass text-walnut text-sm font-bold hover:bg-white/50 transition-colors flex items-center gap-1">
                                        <span className="material-symbols-outlined text-lg">tune</span>
                                        Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="flex flex-col gap-6">
                        <article className="glass-panel p-6 rounded-xl border border-white hover:border-white/80 transition-all hover:bg-white/60 group cursor-pointer relative overflow-hidden">
                            <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between relative z-10">
                                <div className="flex items-center gap-4 min-w-[30%]">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                        <span className="material-symbols-outlined">business</span>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-walnut leading-tight mb-1">Apple Inc. Equity Block</h3>
                                        <p className="text-xs text-walnut/50">ID: #TRX-8992-B</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8 md:gap-12 flex-1 justify-start md:justify-center">
                                    <div className="flex flex-col items-start w-24">
                                        <span className="px-2.5 py-1 rounded-full bg-blue-100/50 border border-blue-200/50 text-blue-700 text-[10px] font-bold uppercase tracking-wider mb-1">Equity</span>
                                    </div>
                                    <div className="flex flex-col items-start w-24">
                                        <p className="text-xs text-walnut/60 font-medium flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">waves</span>
                                            Dark Pool
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-start w-24">
                                        <p className="text-xs text-walnut/60 font-medium">Oct 24, 14:30</p>
                                    </div>
                                </div>
                                <div className="text-right min-w-[15%]">
                                    <p className="text-2xl font-bold text-olive tracking-tight">+$12,450,000.00</p>
                                    <p className="text-xs text-olive/60 font-medium">Settled</p>
                                </div>
                            </div>
                        </article>
                        <article className="glass-panel p-6 rounded-xl border border-white hover:border-white/80 transition-all hover:bg-white/60 group cursor-pointer relative overflow-hidden">
                            <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between relative z-10">
                                <div className="flex items-center gap-4 min-w-[30%]">
                                    <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-600 shrink-0">
                                        <span className="material-symbols-outlined">account_balance</span>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-walnut leading-tight mb-1">US Treasury Bond Setl.</h3>
                                        <p className="text-xs text-walnut/50">ID: #UST-2024-X</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8 md:gap-12 flex-1 justify-start md:justify-center">
                                    <div className="flex flex-col items-start w-24">
                                        <span className="px-2.5 py-1 rounded-full bg-purple-100/50 border border-purple-200/50 text-purple-700 text-[10px] font-bold uppercase tracking-wider mb-1">Fixed Inc</span>
                                    </div>
                                    <div className="flex flex-col items-start w-24">
                                        <p className="text-xs text-walnut/60 font-medium flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">sync_alt</span>
                                            Clearing
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-start w-24">
                                        <p className="text-xs text-walnut/60 font-medium">Oct 24, 09:15</p>
                                    </div>
                                </div>
                                <div className="text-right min-w-[15%]">
                                    <p className="text-2xl font-bold text-walnut tracking-tight">-$4,200,500.00</p>
                                    <p className="text-xs text-walnut/40 font-medium">Debited</p>
                                </div>
                            </div>
                        </article>
                        <article className="glass-panel p-6 rounded-xl border border-white hover:border-white/80 transition-all hover:bg-white/60 group cursor-pointer relative overflow-hidden">
                            <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between relative z-10">
                                <div className="flex items-center gap-4 min-w-[30%]">
                                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-600 shrink-0">
                                        <span className="material-symbols-outlined">currency_exchange</span>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-walnut leading-tight mb-1">EUR/USD Spot FX</h3>
                                        <p className="text-xs text-walnut/50">ID: #FX-EU-991</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8 md:gap-12 flex-1 justify-start md:justify-center">
                                    <div className="flex flex-col items-start w-24">
                                        <span className="px-2.5 py-1 rounded-full bg-emerald-100/50 border border-emerald-200/50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider mb-1">FX Spot</span>
                                    </div>
                                    <div className="flex flex-col items-start w-24">
                                        <p className="text-xs text-walnut/60 font-medium flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">bolt</span>
                                            Instant
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-start w-24">
                                        <p className="text-xs text-walnut/60 font-medium">Oct 23, 16:45</p>
                                    </div>
                                </div>
                                <div className="text-right min-w-[15%]">
                                    <p className="text-2xl font-bold text-olive tracking-tight">+$850,000.00</p>
                                    <p className="text-xs text-olive/60 font-medium">Credited</p>
                                </div>
                            </div>
                        </article>
                        <article className="glass-panel p-6 rounded-xl border border-white hover:border-white/80 transition-all hover:bg-white/60 group cursor-pointer relative overflow-hidden">
                            <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between relative z-10">
                                <div className="flex items-center gap-4 min-w-[30%]">
                                    <div className="w-10 h-10 rounded-full bg-gray-500/10 flex items-center justify-center text-gray-600 shrink-0">
                                        <span className="material-symbols-outlined">receipt</span>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-walnut leading-tight mb-1">Q3 Management Fee</h3>
                                        <p className="text-xs text-walnut/50">ID: #FEE-Q3-23</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8 md:gap-12 flex-1 justify-start md:justify-center">
                                    <div className="flex flex-col items-start w-24">
                                        <span className="px-2.5 py-1 rounded-full bg-gray-200/50 border border-gray-300/50 text-gray-700 text-[10px] font-bold uppercase tracking-wider mb-1">Admin</span>
                                    </div>
                                    <div className="flex flex-col items-start w-24">
                                        <p className="text-xs text-walnut/60 font-medium flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">schedule</span>
                                            Recurring
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-start w-24">
                                        <p className="text-xs text-walnut/60 font-medium">Oct 01, 00:00</p>
                                    </div>
                                </div>
                                <div className="text-right min-w-[15%]">
                                    <p className="text-2xl font-bold text-walnut tracking-tight">-$125,000.00</p>
                                    <p className="text-xs text-walnut/40 font-medium">Invoiced</p>
                                </div>
                            </div>
                        </article>
                        <article className="glass-panel p-6 rounded-xl border border-white hover:border-white/80 transition-all hover:bg-white/60 group cursor-pointer relative overflow-hidden">
                            <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between relative z-10">
                                <div className="flex items-center gap-4 min-w-[30%]">
                                    <div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-600 shrink-0">
                                        <span className="material-symbols-outlined">account_balance_wallet</span>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-walnut leading-tight mb-1">Liquidity Injection</h3>
                                        <p className="text-xs text-walnut/50">ID: #LIQ-MAIN-A</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8 md:gap-12 flex-1 justify-start md:justify-center">
                                    <div className="flex flex-col items-start w-24">
                                        <span className="px-2.5 py-1 rounded-full bg-teal-100/50 border border-teal-200/50 text-teal-700 text-[10px] font-bold uppercase tracking-wider mb-1">Cash</span>
                                    </div>
                                    <div className="flex flex-col items-start w-24">
                                        <p className="text-xs text-walnut/60 font-medium flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">input</span>
                                            Wire
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-start w-24">
                                        <p className="text-xs text-walnut/60 font-medium">Sep 28, 10:00</p>
                                    </div>
                                </div>
                                <div className="text-right min-w-[15%]">
                                    <p className="text-2xl font-bold text-olive tracking-tight">+$50,000,000.00</p>
                                    <p className="text-xs text-olive/60 font-medium">Available</p>
                                </div>
                            </div>
                        </article>
                    </section>
                    <div className="mt-12 text-center pb-20">
                        <button className="glass-panel px-6 py-3 rounded-xl text-walnut text-sm font-bold hover:bg-white/60 transition-all inline-flex items-center gap-2">
                            Load More Transactions
                            <span className="material-symbols-outlined text-lg">expand_more</span>
                        </button>
                    </div>
                </div>
            </main>
            <div className="fixed top-1/4 -left-64 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] mix-blend-multiply filter pointer-events-none z-0"></div>
            <div className="fixed bottom-0 -right-64 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[100px] mix-blend-multiply filter pointer-events-none z-0"></div>
        </div>
    );
};

export default TransactionsPage;
