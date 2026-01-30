import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './Sidebar';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface MetricData {
    financial_health: {
        total_balance_raw: number;
        runway_months: number | null;
        runway_status: string;
    };
    monthly_averages: {
        revenue_raw: number;
        net_burn_raw: number;
        gross_expenses_raw: number;
        is_profitable: boolean;
    };
    growth: {
        trend: string;
        revenue_growth_raw: number;
    };
    volatility: {
        stability: string;
        cash_flow_std_dev: number;
    };
}

interface ForecastData {
    confidence_raw: number;
    predicted_runway_months: number | null;
}

// Risk tier calculation based on reference thresholds
const calculateRiskTier = (runwayMonths: number | null, bufferSafety: number, dti: number) => {
    const isProfitable = runwayMonths === null;

    // HIGH if ANY: runway < 3, buffer < 1, DTI > 50%
    if (!isProfitable && runwayMonths !== null && runwayMonths < 3) {
        return { label: 'High', color: 'text-red-500', bgColor: 'bg-red-500/5 border-red-500/20', barColor: 'bg-red-500', percent: 85 };
    }
    if (bufferSafety < 1) {
        return { label: 'High', color: 'text-red-500', bgColor: 'bg-red-500/5 border-red-500/20', barColor: 'bg-red-500', percent: 85 };
    }
    if (dti > 50) {
        return { label: 'High', color: 'text-red-500', bgColor: 'bg-red-500/5 border-red-500/20', barColor: 'bg-red-500', percent: 85 };
    }

    // LOW if ALL: (runway > 12 OR profitable) AND buffer > 6 AND DTI < 20%
    const runwayOk = isProfitable || (runwayMonths !== null && runwayMonths > 12);
    if (runwayOk && bufferSafety > 6 && dti < 20) {
        return { label: 'Low', color: 'text-olive', bgColor: 'bg-olive/5 border-olive/20', barColor: 'bg-olive', percent: 20 };
    }

    // Otherwise MEDIUM
    return { label: 'Medium', color: 'text-yellow-600', bgColor: 'bg-yellow-500/5 border-yellow-500/20', barColor: 'bg-yellow-500', percent: 50 };
};

const CreditAssessmentPage: React.FC = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [metricData, setMetricData] = useState<MetricData | null>(null);
    const [forecastData, setForecastData] = useState<ForecastData | null>(null);

    // Loan Simulator State
    const [loanAmount, setLoanAmount] = useState(500000); // ₹5 Lakhs default
    const [tenure, setTenure] = useState(24);
    const [interestRate, setInterestRate] = useState(12);

    // Fetch cached metrics
    useEffect(() => {
        const fetchMetrics = async () => {
            if (!user) return;
            setLoading(true);
            setError(null);

            try {
                const { data, error: fetchError } = await supabase
                    .from('cached_metrics')
                    .select('metric_data, forecast_data')
                    .eq('user_id', user.id)
                    .single();

                if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
                if (data) {
                    setMetricData(data.metric_data as MetricData);
                    setForecastData(data.forecast_data as ForecastData);
                }
            } catch (err: any) {
                setError(err.message || 'Failed to fetch metrics');
                console.error('Error fetching metrics:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, [user]);

    // Base Financial Data
    const currentBalance = metricData?.financial_health?.total_balance_raw ?? 0;
    const monthlyRevenue = metricData?.monthly_averages?.revenue_raw ?? 0;
    const monthlyExpenses = metricData?.monthly_averages?.gross_expenses_raw ?? 0;
    const netBurnRaw = metricData?.monthly_averages?.net_burn_raw ?? 0; // Negative if profitable
    const monthlyProfit = monthlyRevenue - monthlyExpenses;
    const isProfitable = monthlyProfit >= 0;
    const confidenceRaw = forecastData?.confidence_raw ?? 0.6; // Default 60%

    // Buffer Safety: balance / monthly_expenses (in months)
    const bufferSafetyMonths = useMemo(() => {
        return monthlyExpenses > 0 ? currentBalance / monthlyExpenses : 12;
    }, [currentBalance, monthlyExpenses]);

    // Stress Margin: (revenue - expenses) / revenue × 100
    const stressMargin = useMemo(() => {
        if (monthlyRevenue <= 0) return 0;
        return Math.max(0, ((monthlyRevenue - monthlyExpenses) / monthlyRevenue) * 100);
    }, [monthlyRevenue, monthlyExpenses]);

    // Current Runway
    const currentRunway = useMemo(() => {
        if (isProfitable) return null; // Profitable = infinite runway
        const burnRate = Math.abs(monthlyProfit);
        return burnRate > 0 ? currentBalance / burnRate : null;
    }, [currentBalance, monthlyProfit, isProfitable]);

    // Safe EMI: 30% of profit if profitable, 5% of revenue if burning
    const safeEmi = useMemo(() => {
        if (isProfitable && monthlyProfit > 0) {
            return monthlyProfit * 0.30;
        }
        return Math.max(0, monthlyRevenue * 0.05);
    }, [monthlyProfit, monthlyRevenue, isProfitable]);

    // Current DTI (no existing loans tracked = 10% placeholder per reference)
    const currentDti = 10;
    const currentRiskTier = useMemo(() => calculateRiskTier(currentRunway, bufferSafetyMonths, currentDti), [currentRunway, bufferSafetyMonths]);

    // Credit Limit: Reverse EMI formula × risk multiplier
    // credit_limit = safe_emi × [(1+r)^n - 1] / [r × (1+r)^n]
    // Using: 24 months tenure, 12% annual (1% monthly)
    const creditLimit = useMemo(() => {
        if (safeEmi <= 0) return 0;
        const r = 0.12 / 12; // 1% monthly
        const n = 24;
        const compoundFactor = Math.pow(1 + r, n); // (1.01)^24 = 1.2697
        const baseLimit = safeEmi * ((compoundFactor - 1) / (r * compoundFactor));

        // Risk multiplier
        const riskMultipliers: Record<string, number> = { 'Low': 1.2, 'Medium': 1.0, 'High': 0.5 };
        return baseLimit * (riskMultipliers[currentRiskTier.label] ?? 1.0);
    }, [safeEmi, currentRiskTier.label]);

    // Confidence Weight
    const confidenceWeight = useMemo(() => confidenceRaw * 100, [confidenceRaw]);

    // EMI Calculation
    const emi = useMemo(() => {
        if (interestRate === 0) return loanAmount / tenure;
        const monthlyRate = interestRate / 12 / 100;
        const compoundFactor = Math.pow(1 + monthlyRate, tenure);
        return Math.round((loanAmount * monthlyRate * compoundFactor) / (compoundFactor - 1));
    }, [loanAmount, tenure, interestRate]);

    // Affordability Ratio: EMI / safe_emi
    const affordabilityRatio = useMemo(() => safeEmi > 0 ? (emi / safeEmi) : Infinity, [emi, safeEmi]);
    const affordabilityPercent = affordabilityRatio * 100;

    const affordabilityStatus = useMemo(() => {
        if (affordabilityPercent <= 70) return { label: 'Comfortable', color: 'text-olive', barColor: 'bg-olive' };
        if (affordabilityPercent <= 100) return { label: 'Tight', color: 'text-yellow-600', barColor: 'bg-yellow-500' };
        if (affordabilityPercent <= 130) return { label: 'Stretching', color: 'text-orange-500', barColor: 'bg-orange-500' };
        return { label: 'Not Recommended', color: 'text-red-500', barColor: 'bg-red-500' };
    }, [affordabilityPercent]);

    // New Runway: (balance + loan) / (burn + EMI)
    const newRunway = useMemo(() => {
        const newBalance = currentBalance + loanAmount;
        const currentBurn = isProfitable ? 0 : Math.abs(monthlyProfit);
        const newBurn = currentBurn + emi;

        if (newBurn <= 0) return null; // Still profitable after EMI
        return newBalance / newBurn;
    }, [currentBalance, loanAmount, monthlyProfit, emi, isProfitable]);

    const runwayChange = useMemo(() => {
        if (currentRunway === null && newRunway === null) return 0;
        if (currentRunway === null && newRunway !== null) return -newRunway; // Was profitable, now burning
        if (currentRunway !== null && newRunway === null) return currentRunway; // Still profitable
        return (newRunway ?? 0) - (currentRunway ?? 0);
    }, [currentRunway, newRunway]);

    // New DTI and Risk Tier after loan
    const newDti = useMemo(() => monthlyRevenue > 0 ? (emi / monthlyRevenue) * 100 : 100, [emi, monthlyRevenue]);
    const newBufferSafety = useMemo(() => {
        const newBalance = currentBalance + loanAmount;
        const newExpenses = monthlyExpenses + emi;
        return newExpenses > 0 ? newBalance / newExpenses : 12;
    }, [currentBalance, loanAmount, monthlyExpenses, emi]);

    const newRiskTier = useMemo(() => calculateRiskTier(newRunway, newBufferSafety, newDti), [newRunway, newBufferSafety, newDti]);
    const riskIncreased = newRiskTier.percent > currentRiskTier.percent;

    // Recommendation based on reference thresholds
    const recommendation = useMemo(() => {
        let text = '';
        let positive = true;

        if (affordabilityPercent <= 70) {
            text = '✅ Comfortably affordable. This loan is well within your capacity.';
        } else if (affordabilityPercent <= 100) {
            text = '⚠️ Affordable but tight. Leaves little margin for unexpected expenses.';
        } else if (affordabilityPercent <= 130) {
            text = '⚠️ Stretching capacity. Consider reducing amount or extending tenure.';
            positive = false;
        } else {
            text = '❌ Not recommended. EMI significantly exceeds your safe capacity.';
            positive = false;
        }

        if (riskIncreased && newRiskTier.label === 'High' && currentRiskTier.label !== 'High') {
            text += ' This loan would move you to High risk tier.';
            positive = false;
        }

        return { text, positive };
    }, [affordabilityPercent, riskIncreased, newRiskTier.label, currentRiskTier.label]);

    const formatCurrency = (value: number) => {
        if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
        if (value >= 100000) return `₹${(value / 100000).toFixed(1)} L`;
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
    };

    const formatCurrencyFull = (value: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
    };

    const formatRunway = (months: number | null) => {
        if (months === null) return 'Profitable';
        return `${months.toFixed(1)} Mo`;
    };

    if (loading) {
        return (
            <div className="relative flex min-h-screen w-full flex-row overflow-hidden bg-background-light text-walnut font-display">
                <Sidebar />
                <main className="flex-1 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="relative flex min-h-screen w-full flex-row overflow-hidden bg-background-light text-walnut font-display">
                <Sidebar />
                <main className="flex-1 flex items-center justify-center p-6">
                    <div className="glass-panel p-8 rounded-xl text-center max-w-md">
                        <span className="material-symbols-outlined text-red-500 text-4xl mb-4 block">error</span>
                        <p className="text-lg font-semibold mb-2">Failed to load assessment</p>
                        <p className="text-walnut/60 text-sm mb-4">{error}</p>
                        <button onClick={() => window.location.reload()} className="btn-liquid px-6 py-2 rounded-lg text-white text-sm font-semibold">Retry</button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen w-full flex-row overflow-hidden bg-background-light text-walnut font-display selection:bg-olive selection:text-white">
            <Sidebar />
            <main className="flex-1 flex flex-col min-w-0 p-4 lg:p-6 lg:pl-0 gap-6 lg:gap-8 overflow-y-auto h-screen">
                {/* Header */}
                <header className="flex flex-wrap justify-between items-end gap-6 px-2">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/40 rounded-xl shadow-glass border border-white/60">
                            <span className="material-symbols-outlined text-walnut text-3xl">credit_card</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-walnut text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight">Credit Assessment</p>
                            <div className="flex items-center gap-2 text-walnut/60">
                                <span className="material-symbols-outlined text-sm">info</span>
                                <p className="text-sm font-medium">Advisory tool • Not a loan application</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Credit Limit */}
                    <div className="glass-panel p-6 rounded-xl hover:bg-white/50 transition-all group duration-300">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-walnut/60 text-xs font-bold uppercase tracking-wider">Credit Limit</p>
                            <span className="material-symbols-outlined text-walnut/30 group-hover:text-walnut transition-colors">account_balance</span>
                        </div>
                        <p className="text-walnut text-3xl font-bold tracking-tight">{formatCurrency(creditLimit)}</p>
                        <div className="mt-2 text-xs text-walnut/50 font-medium">Max recommended borrowing</div>
                    </div>
                    {/* Safe EMI */}
                    <div className="glass-panel p-6 rounded-xl hover:bg-white/50 transition-all group duration-300">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-walnut/60 text-xs font-bold uppercase tracking-wider">Safe EMI</p>
                            <span className="material-symbols-outlined text-walnut/30 group-hover:text-walnut transition-colors">savings</span>
                        </div>
                        <p className="text-walnut text-3xl font-bold tracking-tight">{formatCurrency(safeEmi)}<span className="text-lg text-walnut/40 font-normal">/mo</span></p>
                        <div className="mt-2 text-xs text-walnut/50 font-medium">{isProfitable ? '30% of profit' : '5% of revenue'}</div>
                    </div>
                    {/* Risk Tier */}
                    <div className={`glass-panel p-6 rounded-xl hover:bg-white/50 transition-all group duration-300 ${currentRiskTier.bgColor}`}>
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-walnut/60 text-xs font-bold uppercase tracking-wider">Risk Tier</p>
                            <span className={`material-symbols-outlined ${currentRiskTier.color}`}>shield</span>
                        </div>
                        <p className={`${currentRiskTier.color} text-3xl font-bold tracking-tight`}>{currentRiskTier.label}</p>
                        <div className="mt-2 w-full bg-walnut/10 h-1.5 rounded-full overflow-hidden">
                            <div className={`h-full ${currentRiskTier.barColor}`} style={{ width: `${currentRiskTier.percent}%` }}></div>
                        </div>
                    </div>
                    {/* Stress Margin */}
                    <div className="glass-panel p-6 rounded-xl hover:bg-white/50 transition-all group duration-300">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-walnut/60 text-xs font-bold uppercase tracking-wider">Stress Margin</p>
                            <span className="material-symbols-outlined text-walnut/30 group-hover:text-walnut transition-colors">compress</span>
                        </div>
                        <p className="text-walnut text-3xl font-bold tracking-tight">{stressMargin.toFixed(1)}%</p>
                        <div className="mt-2 text-xs text-walnut/50 font-medium">Revenue drop tolerance</div>
                    </div>
                    {/* Buffer Safety */}
                    <div className="glass-panel p-6 rounded-xl hover:bg-white/50 transition-all group duration-300">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-walnut/60 text-xs font-bold uppercase tracking-wider">Buffer Safety</p>
                            <span className="material-symbols-outlined text-walnut/30 group-hover:text-walnut transition-colors">layers</span>
                        </div>
                        <p className="text-walnut text-3xl font-bold tracking-tight">{bufferSafetyMonths.toFixed(1)} <span className="text-lg text-walnut/40 font-normal">months</span></p>
                        <div className="mt-2 text-xs text-walnut/50 font-medium">Expenses covered by balance</div>
                    </div>
                    {/* Confidence Weight */}
                    <div className="glass-panel p-6 rounded-xl hover:bg-white/50 transition-all group duration-300">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-walnut/60 text-xs font-bold uppercase tracking-wider">Confidence Weight</p>
                            <span className="material-symbols-outlined text-walnut/30 group-hover:text-walnut transition-colors">psychology</span>
                        </div>
                        <p className="text-walnut text-3xl font-bold tracking-tight">{confidenceWeight.toFixed(0)}%</p>
                        <div className="mt-2 text-xs text-walnut/50 font-medium">Assessment reliability</div>
                    </div>
                </div>

                {/* Financial Context Bar */}
                <div className="glass-panel p-4 lg:px-6 lg:py-4 rounded-xl flex flex-wrap justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/40 text-walnut/70">
                            <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
                        </div>
                        <div>
                            <p className="text-walnut/50 text-xs font-bold uppercase tracking-wider">Balance</p>
                            <p className="text-walnut text-lg font-bold">{formatCurrency(currentBalance)}</p>
                        </div>
                    </div>
                    <div className="hidden md:block w-px h-10 bg-walnut/10"></div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/40 text-walnut/70">
                            <span className="material-symbols-outlined text-xl">trending_up</span>
                        </div>
                        <div>
                            <p className="text-walnut/50 text-xs font-bold uppercase tracking-wider">Revenue</p>
                            <p className="text-walnut text-lg font-bold">{formatCurrency(monthlyRevenue)}/mo</p>
                        </div>
                    </div>
                    <div className="hidden md:block w-px h-10 bg-walnut/10"></div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/40 text-walnut/70">
                            <span className="material-symbols-outlined text-xl">trending_down</span>
                        </div>
                        <div>
                            <p className="text-walnut/50 text-xs font-bold uppercase tracking-wider">Expenses</p>
                            <p className="text-walnut text-lg font-bold">{formatCurrency(monthlyExpenses)}/mo</p>
                        </div>
                    </div>
                    <div className="hidden md:block w-px h-10 bg-walnut/10"></div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/40 text-walnut/70">
                            <span className="material-symbols-outlined text-xl">timelapse</span>
                        </div>
                        <div>
                            <p className="text-walnut/50 text-xs font-bold uppercase tracking-wider">Runway</p>
                            <p className="text-walnut text-lg font-bold">{formatRunway(currentRunway)}</p>
                        </div>
                    </div>
                </div>

                {/* Loan Simulator */}
                <div className="glass-panel rounded-2xl overflow-hidden flex flex-col lg:flex-row">
                    {/* Simulator Controls */}
                    <div className="flex-1 p-6 lg:p-8 flex flex-col justify-center gap-6 border-b lg:border-b-0 lg:border-r border-white/50">
                        <div>
                            <h3 className="text-walnut text-xl font-bold">Loan Simulator</h3>
                            <p className="text-walnut/60 text-sm">Model a hypothetical loan to see the impact.</p>
                        </div>
                        {/* Loan Amount */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <label className="text-walnut text-sm font-semibold">Loan Amount</label>
                                <div className="bg-white/40 px-3 py-1 rounded text-walnut font-bold tabular-nums border border-white/60">{formatCurrencyFull(loanAmount)}</div>
                            </div>
                            <input className="w-full accent-walnut" max={5000000} min={100000} step={50000} type="range" value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} />
                            <div className="flex justify-between text-xs text-walnut/40 font-medium"><span>₹1L</span><span>₹50L</span></div>
                        </div>
                        {/* Tenure */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <label className="text-walnut text-sm font-semibold">Tenure</label>
                                <div className="bg-white/40 px-3 py-1 rounded text-walnut font-bold tabular-nums border border-white/60">{tenure} Months</div>
                            </div>
                            <input className="w-full accent-walnut" max={60} min={6} step={6} type="range" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} />
                            <div className="flex justify-between text-xs text-walnut/40 font-medium"><span>6 Mo</span><span>60 Mo</span></div>
                        </div>
                        {/* Interest Rate */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <label className="text-walnut text-sm font-semibold">Interest Rate (p.a)</label>
                                <div className="bg-white/40 px-3 py-1 rounded text-walnut font-bold tabular-nums border border-white/60">{interestRate.toFixed(1)}%</div>
                            </div>
                            <input className="w-full accent-walnut" max={24} min={8} step={0.5} type="range" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} />
                            <div className="flex justify-between text-xs text-walnut/40 font-medium"><span>8%</span><span>24%</span></div>
                        </div>
                    </div>

                    {/* Results Panel */}
                    <div className="flex-1 p-6 lg:p-8 bg-white/20 flex flex-col justify-center gap-5">
                        {/* EMI Display */}
                        <div className="glass-panel p-5 rounded-xl border border-white/80 shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-10">
                                <span className="material-symbols-outlined text-6xl text-walnut">calculate</span>
                            </div>
                            <p className="text-walnut/60 text-xs font-bold uppercase tracking-wider mb-1">Monthly EMI</p>
                            <span className="text-walnut text-4xl font-extrabold tracking-tight">{formatCurrencyFull(emi)}</span>
                        </div>

                        {/* Affordability Ratio */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-walnut text-sm font-semibold">Affordability</span>
                                <span className={`${affordabilityStatus.color} font-bold text-sm`}>{affordabilityPercent.toFixed(0)}% of Safe EMI • {affordabilityStatus.label}</span>
                            </div>
                            <div className="h-3 w-full bg-walnut/10 rounded-full overflow-hidden relative">
                                <div className={`h-full ${affordabilityStatus.barColor} transition-all duration-300`} style={{ width: `${Math.min(affordabilityPercent, 150)}%` }}></div>
                                {/* Threshold markers */}
                                <div className="absolute top-0 bottom-0 w-0.5 bg-walnut/30" style={{ left: '70%' }}></div>
                                <div className="absolute top-0 bottom-0 w-0.5 bg-walnut/30" style={{ left: '100%' }}></div>
                            </div>
                            <div className="flex justify-between mt-1 text-[10px] text-walnut/40 uppercase tracking-wider font-bold">
                                <span>0%</span><span>70%</span><span>100%</span><span>130%+</span>
                            </div>
                        </div>

                        {/* Runway Comparison */}
                        <div className="grid grid-cols-3 gap-3 text-center">
                            <div className="p-3 rounded-lg bg-walnut/5">
                                <p className="text-walnut/50 text-[10px] font-bold uppercase mb-1">Current Runway</p>
                                <p className="text-walnut font-bold">{formatRunway(currentRunway)}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-walnut/5">
                                <p className="text-walnut/50 text-[10px] font-bold uppercase mb-1">New Runway</p>
                                <p className="text-walnut font-bold">{formatRunway(newRunway)}</p>
                            </div>
                            <div className={`p-3 rounded-lg ${runwayChange < 0 ? 'bg-red-500/10' : runwayChange > 0 ? 'bg-olive/10' : 'bg-walnut/5'}`}>
                                <p className="text-walnut/50 text-[10px] font-bold uppercase mb-1">Change</p>
                                <p className={`font-bold ${runwayChange < 0 ? 'text-red-500' : runwayChange > 0 ? 'text-olive' : 'text-walnut'}`}>
                                    {runwayChange === 0 ? 'No Change' : `${runwayChange > 0 ? '+' : ''}${runwayChange.toFixed(1)} Mo`}
                                </p>
                            </div>
                        </div>

                        {/* Risk Tier Comparison */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className={`p-3 rounded-lg ${currentRiskTier.bgColor} border`}>
                                <p className="text-walnut/50 text-[10px] font-bold uppercase mb-1">Current Risk</p>
                                <p className={`${currentRiskTier.color} font-bold`}>{currentRiskTier.label}</p>
                            </div>
                            <div className={`p-3 rounded-lg ${newRiskTier.bgColor} border`}>
                                <p className="text-walnut/50 text-[10px] font-bold uppercase mb-1">New Risk</p>
                                <div className="flex items-center gap-2">
                                    <p className={`${newRiskTier.color} font-bold`}>{newRiskTier.label}</p>
                                    {riskIncreased && <span className="material-symbols-outlined text-red-500 text-sm">warning</span>}
                                </div>
                            </div>
                        </div>

                        {/* Recommendation */}
                        <div className={`p-4 rounded-lg border ${recommendation.positive ? 'bg-olive/10 border-olive/20' : 'bg-red-500/10 border-red-500/20'}`}>
                            <p className={`text-sm font-medium ${recommendation.positive ? 'text-olive' : 'text-red-600'}`}>{recommendation.text}</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CreditAssessmentPage;
