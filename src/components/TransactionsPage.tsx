import React, { useState, useEffect, useMemo, useCallback } from 'react';
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

// Modal form state
interface ManualEntryForm {
    amount: string;
    type: 'CREDIT' | 'DEBIT';
    mode: string;
    narration: string;
    txn_date: string;
    category: string;
}

const initialForm: ManualEntryForm = {
    amount: '',
    type: 'DEBIT',
    mode: 'Manual',
    narration: '',
    txn_date: new Date().toISOString().split('T')[0],
    category: '',
};

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

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState<ManualEntryForm>(initialForm);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Derived filter options from data
    const categories = useMemo(() => {
        const unique = new Set(transactions.map(t => t.category).filter(Boolean));
        return ['All', ...Array.from(unique)] as string[];
    }, [transactions]);

    const modes = useMemo(() => {
        const unique = new Set(transactions.map(t => t.mode).filter(Boolean));
        return ['All', ...Array.from(unique)] as string[];
    }, [transactions]);

    // Existing categories for validation
    const existingCategories = useMemo(() => {
        return new Set(transactions.map(t => t.category?.toLowerCase()).filter(Boolean));
    }, [transactions]);

    // Fetch transactions
    const fetchTransactions = useCallback(async () => {
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
    }, [user]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    // Handle form changes
    const handleFormChange = (field: keyof ManualEntryForm, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    // Submit manual entry
    const handleSubmit = async () => {
        if (!user) return;

        // Validation
        if (!form.amount || parseFloat(form.amount) <= 0) {
            setSubmitError('Please enter a valid amount');
            return;
        }
        if (!form.narration.trim()) {
            setSubmitError('Please enter a description');
            return;
        }
        if (!form.txn_date) {
            setSubmitError('Please select a date');
            return;
        }

        setSubmitting(true);
        setSubmitError(null);

        try {
            // Check if category exists, else use "Other"
            let finalCategory = form.category.trim() || 'Other';
            if (finalCategory !== 'Other' && !existingCategories.has(finalCategory.toLowerCase())) {
                // Category doesn't match existing ones, set to "Other"
                finalCategory = 'Other';
            }

            const { error: insertError } = await supabase
                .from('transactions')
                .insert({
                    user_id: user.id,
                    amount: parseFloat(form.amount),
                    type: form.type,
                    mode: form.mode || 'Manual',
                    narration: form.narration.trim(),
                    txn_date: new Date(form.txn_date).toISOString(),
                    category: finalCategory,
                    is_manual: true,
                });

            if (insertError) throw insertError;

            // Reset form and close modal
            setForm(initialForm);
            setShowModal(false);

            // Reload transactions
            await fetchTransactions();
        } catch (err: any) {
            setSubmitError(err.message || 'Failed to add transaction');
            console.error('Insert error:', err);
        } finally {
            setSubmitting(false);
        }
    };

    // Filtered transactions
    const filteredTransactions = useMemo(() => {
        return transactions.filter(txn => {
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const matchesSearch =
                    (txn.narration?.toLowerCase().includes(q)) ||
                    (txn.txn_id?.toLowerCase().includes(q)) ||
                    txn.id.toLowerCase().includes(q);
                if (!matchesSearch) return false;
            }
            if (typeFilter !== 'All' && txn.type !== typeFilter) return false;
            if (categoryFilter !== 'All' && txn.category !== categoryFilter) return false;
            if (modeFilter !== 'All' && txn.mode !== modeFilter) return false;
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
            'Other': 'more_horiz',
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
            'Other': 'bg-gray-500/10 text-gray-600',
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
                            <button
                                onClick={() => setShowModal(true)}
                                className="btn-liquid px-6 py-2.5 rounded-xl text-white text-sm font-bold shadow-lg flex items-center gap-2 cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-lg">add</span>
                                Manual Entry
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

            {/* Background decorations */}
            <div className="fixed top-1/4 -left-64 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] mix-blend-multiply filter pointer-events-none z-0"></div>
            <div className="fixed bottom-0 -right-64 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[100px] mix-blend-multiply filter pointer-events-none z-0"></div>

            {/* Manual Entry Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-walnut/30 backdrop-blur-sm"
                        onClick={() => !submitting && setShowModal(false)}
                    ></div>

                    {/* Modal */}
                    <div className="relative glass-panel p-8 rounded-2xl shadow-xl border border-white/60 w-full max-w-md mx-4 animate-fade-in">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-walnut">Add Manual Entry</h2>
                            <button
                                onClick={() => !submitting && setShowModal(false)}
                                className="p-2 rounded-lg hover:bg-white/40 transition-colors text-walnut/60 hover:text-walnut"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Error */}
                        {submitError && (
                            <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-200 text-red-600 text-sm">
                                {submitError}
                            </div>
                        )}

                        {/* Form */}
                        <div className="flex flex-col gap-4">
                            {/* Amount */}
                            <div>
                                <label className="block text-xs font-bold text-walnut/60 uppercase tracking-wider mb-1.5">Amount (₹)</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={form.amount}
                                    onChange={(e) => handleFormChange('amount', e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg input-glass text-walnut text-lg font-bold placeholder-walnut/30 focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            {/* Type */}
                            <div>
                                <label className="block text-xs font-bold text-walnut/60 uppercase tracking-wider mb-1.5">Type</label>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleFormChange('type', 'DEBIT')}
                                        className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${form.type === 'DEBIT'
                                                ? 'bg-walnut text-white'
                                                : 'bg-white/40 text-walnut hover:bg-white/60'
                                            }`}
                                    >
                                        Expense (Debit)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleFormChange('type', 'CREDIT')}
                                        className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${form.type === 'CREDIT'
                                                ? 'bg-olive text-white'
                                                : 'bg-white/40 text-walnut hover:bg-white/60'
                                            }`}
                                    >
                                        Income (Credit)
                                    </button>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-bold text-walnut/60 uppercase tracking-wider mb-1.5">Description</label>
                                <input
                                    type="text"
                                    placeholder="Office supplies, Invoice payment, etc."
                                    value={form.narration}
                                    onChange={(e) => handleFormChange('narration', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-lg input-glass text-walnut placeholder-walnut/40 text-sm font-medium focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-xs font-bold text-walnut/60 uppercase tracking-wider mb-1.5">Category</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Payroll, Utilities, Rent..."
                                    value={form.category}
                                    onChange={(e) => handleFormChange('category', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-lg input-glass text-walnut placeholder-walnut/40 text-sm font-medium focus:ring-2 focus:ring-primary/20"
                                />
                                <p className="text-[10px] text-walnut/40 mt-1 ml-1">If unrecognized, will be saved as "Other"</p>
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block text-xs font-bold text-walnut/60 uppercase tracking-wider mb-1.5">Date</label>
                                <input
                                    type="date"
                                    value={form.txn_date}
                                    onChange={(e) => handleFormChange('txn_date', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-lg input-glass text-walnut text-sm font-medium focus:ring-2 focus:ring-primary/20 cursor-pointer"
                                />
                            </div>

                            {/* Mode */}
                            <div>
                                <label className="block text-xs font-bold text-walnut/60 uppercase tracking-wider mb-1.5">Mode</label>
                                <select
                                    value={form.mode}
                                    onChange={(e) => handleFormChange('mode', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-lg input-glass text-walnut text-sm font-medium focus:ring-2 focus:ring-primary/20 cursor-pointer appearance-none"
                                >
                                    <option value="Manual">Manual Entry</option>
                                    <option value="Cash">Cash</option>
                                    <option value="UPI">UPI</option>
                                    <option value="NEFT">NEFT</option>
                                    <option value="IMPS">IMPS</option>
                                    <option value="RTGS">RTGS</option>
                                    <option value="Cheque">Cheque</option>
                                </select>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => !submitting && setShowModal(false)}
                                disabled={submitting}
                                className="flex-1 py-2.5 rounded-lg glass-panel text-walnut font-semibold text-sm hover:bg-white/60 transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="flex-1 py-2.5 rounded-lg btn-liquid text-white font-semibold text-sm shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-lg">add</span>
                                        Add Transaction
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionsPage;
