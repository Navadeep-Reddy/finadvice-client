import { useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
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
    };
}

interface ForecastData {
    trend: string;
    trend_description: string;
    confidence_raw: number;
}

interface MonthlyData {
    month: string; // YYYY-MM
    credits: number;
    debits: number;
    net: number;
}

interface Scheme {
    id: string;
    scheme_name: string;
    category: 'food' | 'healthcare' | 'general';
    description: string;
    created_at: string;
}

const Dashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [metricData, setMetricData] = useState<MetricData | null>(null);
    const [forecastData, setForecastData] = useState<ForecastData | null>(null);
    const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
    const [schemes, setSchemes] = useState<Scheme[]>([]);
    const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

    // Current date/time
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    // Fetch metrics and transactions
    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            setLoading(true);

            try {
                // Fetch cached metrics
                const { data: metricsRow } = await supabase
                    .from('cached_metrics')
                    .select('metric_data, forecast_data')
                    .eq('user_id', user.id)
                    .single();

                if (metricsRow) {
                    setMetricData(metricsRow.metric_data as MetricData);
                    setForecastData(metricsRow.forecast_data as ForecastData);
                }

                // Fetch transactions for chart (last 6 months)
                const sixMonthsAgo = new Date();
                sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

                const { data: transactions } = await supabase
                    .from('transactions')
                    .select('amount, type, txn_date')
                    .eq('user_id', user.id)
                    .gte('txn_date', sixMonthsAgo.toISOString())
                    .order('txn_date', { ascending: true });

                if (transactions && transactions.length > 0) {
                    // Aggregate by month
                    const monthMap = new Map<string, { credits: number; debits: number }>();

                    transactions.forEach((txn) => {
                        const date = new Date(txn.txn_date);
                        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

                        if (!monthMap.has(monthKey)) {
                            monthMap.set(monthKey, { credits: 0, debits: 0 });
                        }

                        const entry = monthMap.get(monthKey)!;
                        if (txn.type === 'CREDIT') {
                            entry.credits += Number(txn.amount);
                        } else {
                            entry.debits += Number(txn.amount);
                        }
                    });

                    // Convert to array and sort
                    const monthlyArray: MonthlyData[] = Array.from(monthMap.entries())
                        .map(([month, data]) => ({
                            month,
                            credits: data.credits,
                            debits: data.debits,
                            net: data.credits - data.debits
                        }))
                        .sort((a, b) => a.month.localeCompare(b.month))
                        .slice(-6); // Last 6 months

                    setMonthlyData(monthlyArray);
                }

                // Fetch schemes for Intelligence Feed (food category only)
                const { data: schemesData, error: schemesError } = await supabase
                    .from('schemes')
                    .select('id, scheme_name, category, description, created_at')
                    .eq('category', 'food')
                    .order('created_at', { ascending: false })
                    .limit(5);

                console.log('Schemes fetch result:', { schemesData, schemesError });

                if (schemesError) {
                    console.error('Schemes fetch error:', schemesError);
                } else if (schemesData && schemesData.length > 0) {
                    setSchemes(schemesData as Scheme[]);
                }
            } catch (err) {
                console.error('Dashboard fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    // Derived values
    const totalBalance = metricData?.financial_health?.total_balance_raw ?? 0;
    const monthlyExpenses = metricData?.monthly_averages?.gross_expenses_raw ?? 0;
    const revenueGrowth = metricData?.growth?.revenue_growth_raw ?? 0;
    const growthTrend = metricData?.growth?.trend ?? 'Stable';
    const runwayStatus = metricData?.financial_health?.runway_status ?? 'Unknown';
    const runwayMonths = metricData?.financial_health?.runway_months;
    const volatility = metricData?.volatility?.stability ?? 'Unknown';
    const forecastTrend = forecastData?.trend ?? 'stable';

    // Total YTD volume (sum of all transaction amounts)
    const totalVolumeYTD = useMemo(() => {
        return monthlyData.reduce((sum, m) => sum + m.credits + m.debits, 0);
    }, [monthlyData]);

    // Chart calculations
    const chartData = useMemo(() => {
        if (monthlyData.length === 0) return { path: '', fillPath: '', points: [], maxValue: 100, minValue: 0 };

        const values = monthlyData.map(m => m.net);
        const maxValue = Math.max(...values, 0);
        const minValue = Math.min(...values, 0);
        const range = maxValue - minValue || 1;

        const width = 800;
        const height = 280;
        const padding = 20;

        const points = values.map((v, i) => ({
            x: padding + (i * (width - padding * 2)) / Math.max(values.length - 1, 1),
            y: height - padding - ((v - minValue) / range) * (height - padding * 2),
            value: v,
            month: monthlyData[i].month
        }));

        // Generate smooth curve path
        let path = `M${points[0].x},${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const cpX = (prev.x + curr.x) / 2;
            path += ` C${cpX},${prev.y} ${cpX},${curr.y} ${curr.x},${curr.y}`;
        }

        // Fill area
        const fillPath = path + ` L${points[points.length - 1].x},${height} L${points[0].x},${height} Z`;

        return { path, fillPath, points, maxValue, minValue };
    }, [monthlyData]);

    const formatCurrency = (value: number) => {
        if (Math.abs(value) >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
        if (Math.abs(value) >= 100000) return `₹${(value / 100000).toFixed(1)} L`;
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-IN', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).toUpperCase();
    };

    const formatMonthLabel = (monthKey: string) => {
        const [year, month] = monthKey.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return date.toLocaleDateString('en-IN', { month: 'short' });
    };

    const formatRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
        return `${Math.floor(diffDays / 365)}y ago`;
    };

    const handleExport = async () => {
        if (!user) return;

        try {
            // 1. Fetch all data
            const [
                { data: transactions },
                { data: accounts },
                { data: recurring },
                { data: metrics }
            ] = await Promise.all([
                supabase.from('transactions').select('*').eq('user_id', user.id).order('txn_date', { ascending: false }),
                supabase.from('accounts').select('*').eq('user_id', user.id),
                supabase.from('recurring_transactions').select('*').eq('user_id', user.id),
                supabase.from('cached_metrics').select('metric_data, calculated_at').eq('user_id', user.id).single()
            ]);

            // 2. Prepare Worksheets
            const wb = XLSX.utils.book_new();

            // Transactions Sheet
            if (transactions?.length) {
                const txnWs = XLSX.utils.json_to_sheet(transactions.map(t => ({
                    Date: t.txn_date ? new Date(t.txn_date).toLocaleDateString() : '',
                    Description: t.narration,
                    Amount: t.amount,
                    Type: t.type,
                    Category: t.category || 'Uncategorized',
                    Mode: t.mode || '-',
                    ID: t.txn_id || t.id
                })));
                XLSX.utils.book_append_sheet(wb, txnWs, "Transactions");
            }

            // Accounts Sheet
            if (accounts?.length) {
                const accWs = XLSX.utils.json_to_sheet(accounts.map(a => ({
                    Bank: a.fip_name,
                    Type: a.account_type,
                    Account: a.masked_account_number,
                    Balance: a.balance,
                    Last_Synced: a.last_synced_at ? new Date(a.last_synced_at).toLocaleString() : ''
                })));
                XLSX.utils.book_append_sheet(wb, accWs, "Accounts");
            }

            // Recurring Sheet
            if (recurring?.length) {
                const recWs = XLSX.utils.json_to_sheet(recurring.map(r => ({
                    Pattern: r.narration_pattern,
                    Avg_Amount: r.avg_amount,
                    Frequency_Days: r.frequency_days,
                    Next_Due: r.next_expected ? new Date(r.next_expected).toLocaleDateString() : '',
                    Category: r.category
                })));
                XLSX.utils.book_append_sheet(wb, recWs, "Recurring");
            }

            // Metrics Sheet
            if (metrics) {
                const mData = metrics.metric_data as MetricData;
                const metricsList = [
                    { Metric: 'Total Balance', Value: mData.financial_health.total_balance_raw },
                    { Metric: 'Monthly Revenue', Value: mData.monthly_averages.revenue_raw },
                    { Metric: 'Monthly Expenses', Value: mData.monthly_averages.gross_expenses_raw },
                    { Metric: 'Net Burn', Value: mData.monthly_averages.net_burn_raw },
                    { Metric: 'Runway Months', Value: mData.financial_health.runway_months },
                    { Metric: 'Revenue Growth %', Value: mData.growth.revenue_growth_raw },
                    { Metric: 'Growth Trend', Value: mData.growth.trend },
                    { Metric: 'Stability', Value: mData.volatility.stability },
                    { Metric: 'Calculated At', Value: metrics.calculated_at ? new Date(metrics.calculated_at).toLocaleString() : '' }
                ];
                const metricWs = XLSX.utils.json_to_sheet(metricsList);
                XLSX.utils.book_append_sheet(wb, metricWs, "Financial Health");
            }

            // 3. Save File
            const dateStr = new Date().toISOString().split('T')[0];
            XLSX.writeFile(wb, `financial_export_${dateStr}.xlsx`);

        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export data. Please try again.');
        }
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

    return (
        <div className="relative flex min-h-screen w-full flex-row overflow-hidden bg-background-light text-walnut font-display selection:bg-olive selection:text-white">
            <Sidebar />
            <main className="flex-1 flex flex-col min-w-0 p-4 lg:p-6 lg:pl-0 gap-6 lg:gap-8 overflow-y-auto h-screen">
                {/* Header */}
                <header className="flex flex-wrap justify-between items-end gap-6 px-2">
                    <div className="flex flex-col gap-2">
                        <p className="text-walnut text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight">Welcome back</p>
                        <div className="flex items-center gap-2 text-walnut/60">
                            <span className="material-symbols-outlined text-sm">schedule</span>
                            <p className="text-sm font-medium tracking-wide uppercase">{formatDate(currentTime)} • {formatTime(currentTime)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleExport}
                            className="glass-panel px-4 py-2.5 rounded-lg text-sm font-semibold text-walnut hover:bg-white/60 transition-all flex items-center gap-2 cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-lg">download</span>
                            Export Data
                        </button>
                    </div>
                </header>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Current Balance */}
                    <div className="glass-panel p-6 rounded-xl hover:bg-white/50 transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-white/40 rounded-lg text-walnut group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined block">account_balance_wallet</span>
                            </div>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${forecastTrend === 'improving'
                                ? 'bg-olive/10 text-olive'
                                : forecastTrend === 'declining'
                                    ? 'bg-red-100 text-red-600'
                                    : 'bg-walnut/10 text-walnut'
                                }`}>
                                <span className="material-symbols-outlined text-sm">
                                    {forecastTrend === 'improving' ? 'trending_up' : forecastTrend === 'declining' ? 'trending_down' : 'trending_flat'}
                                </span>
                                {forecastTrend.charAt(0).toUpperCase() + forecastTrend.slice(1)}
                            </span>
                        </div>
                        <p className="text-walnut/60 text-sm font-medium mb-1">Current Balance</p>
                        <p className="text-walnut text-3xl font-bold tracking-tight">{formatCurrency(totalBalance)}</p>
                    </div>

                    {/* Monthly Expenses */}
                    <div className="glass-panel p-6 rounded-xl hover:bg-white/50 transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-white/40 rounded-lg text-walnut group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined block">local_fire_department</span>
                            </div>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${volatility === 'Stable'
                                ? 'bg-olive/10 text-olive'
                                : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                <span className="material-symbols-outlined text-sm">
                                    {volatility === 'Stable' ? 'check_circle' : 'warning'}
                                </span>
                                {volatility}
                            </span>
                        </div>
                        <p className="text-walnut/60 text-sm font-medium mb-1">Monthly Expenses</p>
                        <p className="text-walnut text-3xl font-bold tracking-tight">{formatCurrency(monthlyExpenses)}<span className="text-lg text-walnut/40 font-normal">/mo</span></p>
                    </div>

                    {/* Revenue Growth */}
                    <div className="glass-panel p-6 rounded-xl hover:bg-white/50 transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-white/40 rounded-lg text-walnut group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined block">trending_up</span>
                            </div>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${revenueGrowth > 0
                                ? 'bg-olive/10 text-olive'
                                : revenueGrowth < 0
                                    ? 'bg-red-100 text-red-600'
                                    : 'bg-walnut/10 text-walnut'
                                }`}>
                                <span className="material-symbols-outlined text-sm">
                                    {revenueGrowth > 0 ? 'trending_up' : revenueGrowth < 0 ? 'trending_down' : 'trending_flat'}
                                </span>
                                {revenueGrowth > 0 ? '+' : ''}{revenueGrowth.toFixed(1)}%
                            </span>
                        </div>
                        <p className="text-walnut/60 text-sm font-medium mb-1">Revenue Growth</p>
                        <p className="text-walnut text-3xl font-bold tracking-tight">{growthTrend}</p>
                    </div>
                </div>

                {/* Dashboard Grid: Charts + Feed */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 flex-1">
                    {/* Main Chart Section */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <div className="glass-panel p-6 lg:p-8 rounded-2xl flex-1 flex flex-col justify-between min-h-[500px]">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
                                <div>
                                    <h2 className="text-walnut text-lg font-bold mb-1">Net Cash Flow</h2>
                                    <p className="text-walnut/60 text-sm">Monthly income minus expenses over time.</p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <p className="thermal-text text-4xl lg:text-5xl font-black tracking-tighter leading-none">{formatCurrency(totalVolumeYTD)}</p>
                                    <p className="text-walnut/50 text-xs font-medium uppercase tracking-wider mt-1">Total Volume</p>
                                </div>
                            </div>

                            {/* Chart Container */}
                            <div className="relative w-full flex-1 min-h-[300px]">
                                {monthlyData.length > 0 ? (
                                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 300">
                                        <defs>
                                            <linearGradient id="thermalGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                                                <stop offset="0%" style={{ stopColor: '#8A2BE2', stopOpacity: 1 }}></stop>
                                                <stop offset="100%" style={{ stopColor: '#FFA500', stopOpacity: 1 }}></stop>
                                            </linearGradient>
                                            <linearGradient id="thermalFill" x1="0%" x2="0%" y1="0%" y2="100%">
                                                <stop offset="0%" style={{ stopColor: '#8A2BE2', stopOpacity: 0.2 }}></stop>
                                                <stop offset="100%" style={{ stopColor: '#FFA500', stopOpacity: 0 }}></stop>
                                            </linearGradient>
                                            <filter height="140%" id="glow" width="140%" x="-20%" y="-20%">
                                                <feGaussianBlur result="coloredBlur" stdDeviation="4"></feGaussianBlur>
                                                <feMerge>
                                                    <feMergeNode in="coloredBlur"></feMergeNode>
                                                    <feMergeNode in="SourceGraphic"></feMergeNode>
                                                </feMerge>
                                            </filter>
                                        </defs>
                                        {/* Grid Lines */}
                                        <line stroke="rgba(72, 64, 60, 0.05)" strokeWidth="1" x1="0" x2="800" y1="75" y2="75"></line>
                                        <line stroke="rgba(72, 64, 60, 0.05)" strokeWidth="1" x1="0" x2="800" y1="150" y2="150"></line>
                                        <line stroke="rgba(72, 64, 60, 0.05)" strokeWidth="1" x1="0" x2="800" y1="225" y2="225"></line>
                                        {/* Area Fill */}
                                        <path d={chartData.fillPath} fill="url(#thermalFill)"></path>
                                        {/* Main Line */}
                                        <path d={chartData.path} fill="none" filter="url(#glow)" stroke="url(#thermalGradient)" strokeLinecap="round" strokeWidth="4"></path>
                                        {/* Data Points with hover */}
                                        {chartData.points.map((point, i) => (
                                            <g key={i}>
                                                {/* Invisible larger hit area */}
                                                <circle
                                                    cx={point.x}
                                                    cy={point.y}
                                                    r="20"
                                                    fill="transparent"
                                                    style={{ cursor: 'pointer' }}
                                                    onMouseEnter={() => setHoveredPointIndex(i)}
                                                    onMouseLeave={() => setHoveredPointIndex(null)}
                                                />
                                                {/* Visible point */}
                                                <circle
                                                    cx={point.x}
                                                    cy={point.y}
                                                    fill={hoveredPointIndex === i ? '#8A2BE2' : '#F0EEE9'}
                                                    r={hoveredPointIndex === i ? 8 : 6}
                                                    stroke="#8A2BE2"
                                                    strokeWidth="3"
                                                    style={{ transition: 'all 0.2s ease', cursor: 'pointer' }}
                                                    onMouseEnter={() => setHoveredPointIndex(i)}
                                                    onMouseLeave={() => setHoveredPointIndex(null)}
                                                />
                                            </g>
                                        ))}
                                    </svg>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-walnut/40">
                                        <p>No transaction data available</p>
                                    </div>
                                )}

                                {/* Interactive Tooltip */}
                                {hoveredPointIndex !== null && chartData.points[hoveredPointIndex] && (
                                    <div
                                        className="absolute bg-white/95 backdrop-blur-md p-3 rounded-lg shadow-xl border border-white/60 pointer-events-none z-10 transition-all duration-150"
                                        style={{
                                            left: `${(chartData.points[hoveredPointIndex].x / 800) * 100}%`,
                                            top: `${(chartData.points[hoveredPointIndex].y / 300) * 100}%`,
                                            transform: 'translate(-50%, -130%)'
                                        }}
                                    >
                                        <p className="text-xs font-bold text-walnut mb-1">{formatMonthLabel(chartData.points[hoveredPointIndex].month)} {chartData.points[hoveredPointIndex].month.split('-')[0]}</p>
                                        <p className={`text-lg font-bold ${chartData.points[hoveredPointIndex].value >= 0 ? 'text-olive' : 'text-red-500'}`}>
                                            {formatCurrency(chartData.points[hoveredPointIndex].value)}
                                        </p>
                                        <p className="text-[10px] text-walnut/50 mt-1">Net Cash Flow</p>
                                    </div>
                                )}
                            </div>

                            {/* X Axis Labels */}
                            <div className="flex justify-between px-2 mt-4 text-walnut/40 text-xs font-semibold uppercase tracking-wider">
                                {monthlyData.map((m) => (
                                    <span key={m.month}>{formatMonthLabel(m.month)}</span>
                                ))}
                            </div>
                        </div>

                        {/* Secondary Metrics Row */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="glass-panel p-5 rounded-xl flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${runwayStatus === 'Profitable' ? 'bg-olive/10' : runwayStatus === 'Critical' ? 'bg-red-100' : 'bg-yellow-100'
                                    }`}>
                                    <span className={`material-symbols-outlined ${runwayStatus === 'Profitable' ? 'text-olive' : runwayStatus === 'Critical' ? 'text-red-500' : 'text-yellow-600'
                                        }`}>
                                        {runwayStatus === 'Profitable' ? 'trending_up' : 'timelapse'}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-walnut/50 text-xs font-bold uppercase tracking-wider">Runway Status</p>
                                    <p className="text-walnut font-bold text-lg">
                                        {runwayStatus === 'Profitable' ? 'Profitable' : runwayMonths ? `${runwayMonths.toFixed(0)} Months` : runwayStatus}
                                    </p>
                                </div>
                            </div>
                            <div className="glass-panel p-5 rounded-xl flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${forecastTrend === 'improving' ? 'bg-olive/10' : forecastTrend === 'declining' ? 'bg-red-100' : 'bg-walnut/10'
                                    }`}>
                                    <span className={`material-symbols-outlined ${forecastTrend === 'improving' ? 'text-olive' : forecastTrend === 'declining' ? 'text-red-500' : 'text-walnut'
                                        }`}>auto_graph</span>
                                </div>
                                <div>
                                    <p className="text-walnut/50 text-xs font-bold uppercase tracking-wider">Forecast Trend</p>
                                    <p className="text-walnut font-bold text-lg">{forecastTrend.charAt(0).toUpperCase() + forecastTrend.slice(1)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Intelligence Feed */}
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h2 className="text-walnut text-xl font-bold tracking-tight">Intelligence Feed</h2>
                            <button className="text-primary text-sm font-semibold hover:underline">View All</button>
                        </div>
                        <div className="flex flex-col gap-4 flex-1">
                            {schemes.length > 0 ? (
                                schemes.map((scheme) => (
                                    <div
                                        key={scheme.id}
                                        className="glass-panel p-5 rounded-xl hover:-translate-y-1 hover:bg-white/60 transition-all duration-300 cursor-pointer relative overflow-hidden group"
                                    >
                                        <div className={`absolute top-0 left-0 w-1 h-full transition-colors ${scheme.category === 'food'
                                            ? 'bg-orange-400/30 group-hover:bg-orange-400'
                                            : scheme.category === 'healthcare'
                                                ? 'bg-red-400/30 group-hover:bg-red-400'
                                                : 'bg-primary/30 group-hover:bg-primary'
                                            }`}></div>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="px-2 py-0.5 rounded border border-walnut/10 bg-white/30 text-[10px] font-bold uppercase tracking-wider text-walnut/60">
                                                {scheme.category}
                                            </span>
                                            <span className="text-walnut/40 text-xs">{formatRelativeTime(scheme.created_at)}</span>
                                        </div>
                                        <h3 className={`text-walnut font-bold text-base leading-snug mb-2 transition-colors ${scheme.category === 'food'
                                            ? 'group-hover:text-orange-500'
                                            : scheme.category === 'healthcare'
                                                ? 'group-hover:text-red-500'
                                                : 'group-hover:text-primary'
                                            }`}>{scheme.scheme_name}</h3>
                                        <p className="text-walnut/60 text-sm leading-relaxed line-clamp-2">{scheme.description}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="glass-panel p-5 rounded-xl text-center text-walnut/40">
                                    <span className="material-symbols-outlined text-3xl mb-2 block">lightbulb</span>
                                    <p className="text-sm">No schemes available</p>
                                </div>
                            )}
                            <div className="mt-auto pt-4 flex justify-center">
                                <span className="material-symbols-outlined text-walnut/20 animate-bounce">expand_more</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
