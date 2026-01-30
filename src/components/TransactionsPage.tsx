import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './Sidebar';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface Transaction {
    id: string;
    txn_id: string | null;
    amount: number;
    type: 'CREDIT' | 'DEBIT';
    mode: string | null;
    narration: string | null;
    txn_date: string | null;
    category: string | null;
}

const TransactionsPage: React.FC = () => {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState<string>('All');
    const [categoryFilter, setCategoryFilter] = useState<string>('All');
    const [modeFilter, setModeFilter] = useState<string>('All');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    // Derived filter options from data
    const categories = useMemo(() => {
        const unique = new Set(transactions.map(t => t.category).filter(Boolean));
        return ['All', ...Array.from(unique)] as string[];
    }, [transactions]);

    const modes = useMemo(() => {
        const unique = new Set(transactions.map(t => t.mode).filter(Boolean));
        return ['All', ...Array.from(unique)] as string[];
    }, [transactions]);

    // Fetch transactions
    useEffect(() => {
        const fetchTransactions = async () => {
            if (!user) return;
            setLoading(true);
            setError(null);

            try {
                const { data, error: fetchError } = await supabase
                    .from('transactions')
                    .select('id, txn_id, amount, type, mode, narration, txn_date, category')
                    .eq('user_id', user.id)
                    .order('txn_date', { ascending: false })
                    .limit(50);

                if (fetchError) throw fetchError;
                setTransactions(data || []);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch transactions');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [user]);

    // Filtered transactions
    const filteredTransactions = useMemo(() => {
        return transactions.filter(txn => {
            // Search filter
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const matchesSearch =
                    (txn.narration?.toLowerCase().includes(q)) ||
                    (txn.txn_id?.toLowerCase().includes(q)) ||
                    txn.id.toLowerCase().includes(q);
                if (!matchesSearch) return false;
            }
            // Type filter
            if (typeFilter !== 'All' && txn.type !== typeFilter) return false;
            // Category filter
            if (categoryFilter !== 'All' && txn.category !== categoryFilter) return false;
            // Mode filter
            if (modeFilter !== 'All' && txn.mode !== modeFilter) return false;
            // Date filter
            if (startDate && txn.txn_date) {
                if (new Date(txn.txn_date) < new Date(startDate)) return false;
            }
            if (endDate && txn.txn_date) {
                if (new Date(txn.txn_date) > new Date(endDate + 'T23:59:59')) return false;
            }
            return true;
        });
    }, [transactions, searchQuery, typeFilter, categoryFilter, modeFilter, startDate, endDate]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value);
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const getIconForCategory = (category: string | null): string => {
        const map: Record<string, string> = {
            'Payroll': 'groups',
            'Utilities': 'bolt',
            'Rent': 'home',
            'Supplies': 'inventory_2',
            'Sales': 'storefront',
        };
        return map[category || ''] || 'receipt';
    };

    const getColorForCategory = (category: string | null): string => {
        const map: Record<string, string> = {
            'Payroll': 'bg-blue-500/10 text-blue-600',
            'Utilities': 'bg-yellow-500/10 text-yellow-600',
            'Rent': 'bg-purple-500/10 text-purple-600',
            'Supplies': 'bg-orange-500/10 text-orange-600',
            'Sales': 'bg-green-500/10 text-green-600',
        };
        return map[category || ''] || 'bg-gray-500/10 text-gray-600';
    };

    return (
        <div className="relative flex min-h-screen w-full flex-row overflow-hidden bg-background-light text-walnut font-display selection:bg-olive selection:text-white bg-grid">
            <Sidebar />
            <main className="flex-1 h-full overflow-y-auto relative p-6 lg:p-12 lg:pl-0 z-10">
                <div className="max-w-7xl mx-auto flex flex-col h-full">
                    <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                        <div>
                            <h1 className="text-4xl font-bold text-walnut tracking-tight mb-2">Transaction Ledger</h1>
                            <p className="text-walnut/60 text-lg">Detailed history of all your transactions.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="glass-panel px-4 py-2.5 rounded-xl text-walnut text-sm font-bold hover:bg-white/60 transition-all flex items-center gap-2 cursor-pointer">
                                <span className="material-symbols-outlined text-lg">download</span>
                                Export CSV
                            </button>
                            <button className="btn-liquid px-6 py-2.5 rounded-xl text-white text-sm font-bold shadow-lg flex items-center gap-2 cursor-pointer">
                                <span className="material-symbols-outlined text-lg">add</span>
                                New Transfer
                            </button>
                        </div>
                    </header>

                    {/* Filters Section */}
                    <section className="glass-panel p-5 rounded-2xl mb-8 border border-white/60 shadow-glass">
                        <div className="flex flex-wrap items-end gap-4 lg:gap-6">
                            {/* Search */}
                            <div className="flex-1 min-w-[200px] relative">
                                <label className="block text-xs font-bold text-walnut/50 uppercase tracking-wider mb-1.5 ml-1">Search</label>
                                <span className="material-symbols-outlined absolute left-3 bottom-2.5 text-walnut/40">search</span>
                                <input
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg input-glass text-walnut placeholder-walnut/40 text-sm font-medium focus:ring-0"
                                    placeholder="Search by ID, narration..."
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="hidden lg:block w-px h-10 bg-walnut/10 self-end mb-1"></div>
                            {/* Date Range */}
                            <div className="relative">
                                <label className="block text-xs font-bold text-walnut/50 uppercase tracking-wider mb-1.5 ml-1">Period</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        className="px-3 py-2 rounded-lg input-glass text-walnut text-sm font-medium focus:ring-0 w-36 cursor-pointer"
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                    <span className="text-walnut/40">-</span>
                                    <input
                                        className="px-3 py-2 rounded-lg input-glass text-walnut text-sm font-medium focus:ring-0 w-36 cursor-pointer"
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>
                            </div>
                            {/* Type Filter */}
                            <div className="relative">
                                <label className="block text-xs font-bold text-walnut/50 uppercase tracking-wider mb-1.5 ml-1">Type</label>
                                <div className="relative">
                                    <select
                                        className="px-3 py-2 rounded-lg input-glass text-walnut text-sm font-medium focus:ring-0 w-32 cursor-pointer appearance-none pr-8"
                                        value={typeFilter}
                                        onChange={(e) => setTypeFilter(e.target.value)}
                                    >
                                        <option value="All">All</option>
                                        <option value="CREDIT">Credit</option>
                                        <option value="DEBIT">Debit</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-walnut/50 pointer-events-none text-lg">expand_more</span>
                                </div>
                            </div>
                            {/* Category Filter */}
                            <div className="relative">
                                <label className="block text-xs font-bold text-walnut/50 uppercase tracking-wider mb-1.5 ml-1">Category</label>
                                <div className="relative">
                                    <select
                                        className="px-3 py-2 rounded-lg input-glass text-walnut text-sm font-medium focus:ring-0 w-36 cursor-pointer appearance-none pr-8"
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                    >
                                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                    <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-walnut/50 pointer-events-none text-lg">expand_more</span>
                                </div>
                            </div>
                            {/* Mode Filter */}
                            <div className="relative">
                                <label className="block text-xs font-bold text-walnut/50 uppercase tracking-wider mb-1.5 ml-1">Mode</label>
                                <div className="relative">
                                    <select
                                        className="px-3 py-2 rounded-lg input-glass text-walnut text-sm font-medium focus:ring-0 w-32 cursor-pointer appearance-none pr-8"
                                        value={modeFilter}
                                        onChange={(e) => setModeFilter(e.target.value)}
                                    >
                                        {modes.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                    <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-walnut/50 pointer-events-none text-lg">expand_more</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Transactions List */}
                    <section className="flex flex-col gap-6">
                        {loading && (
                            <div className="flex items-center justify-center py-20">
                                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                            </div>
                        )}
                        {error && (
                            <div className="glass-panel p-6 rounded-xl text-center text-red-600">
                                <p>{error}</p>
                            </div>
                        )}
                        {!loading && !error && filteredTransactions.length === 0 && (
                            <div className="glass-panel p-12 rounded-xl text-center text-walnut/60">
                                <span className="material-symbols-outlined text-5xl mb-4 block">receipt_long</span>
                                <p className="text-lg font-semibold">No transactions found</p>
                                <p className="text-sm">Try adjusting your filters.</p>
                            </div>
                        )}
                        {!loading && !error && filteredTransactions.map(txn => (
                            <article key={txn.id} className="glass-panel p-6 rounded-xl border border-white hover:border-white/80 transition-all hover:bg-white/60 group cursor-pointer relative overflow-hidden">
                                <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between relative z-10">
                                    <div className="flex items-center gap-4 min-w-[30%]">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getColorForCategory(txn.category)}`}>
                                            <span className="material-symbols-outlined">{getIconForCategory(txn.category)}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-walnut leading-tight mb-1">{txn.narration || 'Transaction'}</h3>
                                            <p className="text-xs text-walnut/50">ID: #{txn.txn_id || txn.id.slice(0, 8)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8 md:gap-12 flex-1 justify-start md:justify-center">
                                        <div className="flex flex-col items-start w-24">
                                            {txn.category && (
                                                <span className="px-2.5 py-1 rounded-full bg-walnut/5 border border-walnut/10 text-walnut/70 text-[10px] font-bold uppercase tracking-wider mb-1">{txn.category}</span>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-start w-24">
                                            {txn.mode && (
                                                <p className="text-xs text-walnut/60 font-medium flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">sync_alt</span>
                                                    {txn.mode}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-start w-28">
                                            <p className="text-xs text-walnut/60 font-medium">{formatDate(txn.txn_date)}</p>
                                        </div>
                                    </div>
                                    <div className="text-right min-w-[15%]">
                                        <p className={`text-2xl font-bold tracking-tight ${txn.type === 'CREDIT' ? 'text-olive' : 'text-walnut'}`}>
                                            {txn.type === 'CREDIT' ? '+' : '-'}{formatCurrency(txn.amount)}
                                        </p>
                                        <p className={`text-xs font-medium ${txn.type === 'CREDIT' ? 'text-olive/60' : 'text-walnut/40'}`}>
                                            {txn.type === 'CREDIT' ? 'Credited' : 'Debited'}
                                        </p>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </section>

                    {!loading && filteredTransactions.length > 0 && (
                        <div className="mt-12 text-center pb-20">
                            <p className="text-walnut/50 text-sm">Showing {filteredTransactions.length} of {transactions.length} transactions</p>
                        </div>
                    )}
                </div>
            </main>
            <div className="fixed top-1/4 -left-64 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] mix-blend-multiply filter pointer-events-none z-0"></div>
            <div className="fixed bottom-0 -right-64 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[100px] mix-blend-multiply filter pointer-events-none z-0"></div>
        </div>
    );
};

export default TransactionsPage;
