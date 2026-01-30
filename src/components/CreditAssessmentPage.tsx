import React, { useState, useMemo } from 'react';
import Sidebar from './Sidebar';

const CreditAssessmentPage: React.FC = () => {
    // Loan Simulator State
    const [loanAmount, setLoanAmount] = useState(2500000);
    const [tenure, setTenure] = useState(24);
    const [interestRate, setInterestRate] = useState(12.5);

    // EMI Calculation (Reducing Balance Method)
    const emi = useMemo(() => {
        const principal = loanAmount;
        const monthlyRate = interestRate / 12 / 100;
        const n = tenure;
        if (monthlyRate === 0) return principal / n;
        const emiValue = (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
        return Math.round(emiValue);
    }, [loanAmount, tenure, interestRate]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
    };

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
                                <span className="material-symbols-outlined text-sm">verified_user</span>
                                <p className="text-sm font-medium tracking-wide uppercase">Institutional Grade • Updated Today</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="glass-panel px-4 py-2.5 rounded-lg text-sm font-semibold text-walnut hover:bg-white/60 transition-all flex items-center gap-2 cursor-pointer">
                            <span className="material-symbols-outlined text-lg">history</span>
                            History
                        </button>
                        <button className="btn-liquid px-6 py-2.5 rounded-lg text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center gap-2 cursor-pointer">
                            <span className="material-symbols-outlined text-lg">send</span>
                            Request Review
                        </button>
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
                        <p className="text-walnut text-3xl font-bold tracking-tight">₹85.5 L</p>
                        <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs font-medium text-olive bg-olive/10 px-2 py-0.5 rounded-full">+15% YoY</span>
                        </div>
                    </div>
                    {/* Safe EMI Capacity */}
                    <div className="glass-panel p-6 rounded-xl hover:bg-white/50 transition-all group duration-300">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-walnut/60 text-xs font-bold uppercase tracking-wider">Safe EMI Capacity</p>
                            <span className="material-symbols-outlined text-walnut/30 group-hover:text-walnut transition-colors">savings</span>
                        </div>
                        <p className="text-walnut text-3xl font-bold tracking-tight">₹3.2 L<span className="text-lg text-walnut/40 font-normal">/mo</span></p>
                        <div className="mt-2 text-xs text-walnut/50 font-medium">Based on current cash flow</div>
                    </div>
                    {/* Risk Tier */}
                    <div className="glass-panel p-6 rounded-xl hover:bg-white/50 transition-all group duration-300 bg-olive/5 border-olive/20">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-walnut/60 text-xs font-bold uppercase tracking-wider">Risk Tier</p>
                            <span className="material-symbols-outlined text-olive">shield</span>
                        </div>
                        <p className="text-olive text-3xl font-bold tracking-tight">Low Risk</p>
                        <div className="mt-2 w-full bg-walnut/10 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-olive h-full w-[20%]"></div>
                        </div>
                    </div>
                    {/* Stress Margin */}
                    <div className="glass-panel p-6 rounded-xl hover:bg-white/50 transition-all group duration-300">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-walnut/60 text-xs font-bold uppercase tracking-wider">Stress Margin</p>
                            <span className="material-symbols-outlined text-walnut/30 group-hover:text-walnut transition-colors">compress</span>
                        </div>
                        <p className="text-walnut text-3xl font-bold tracking-tight">24.8%</p>
                        <div className="mt-2 text-xs text-walnut/50 font-medium">Resilience to revenue dip</div>
                    </div>
                    {/* Buffer Safety */}
                    <div className="glass-panel p-6 rounded-xl hover:bg-white/50 transition-all group duration-300">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-walnut/60 text-xs font-bold uppercase tracking-wider">Buffer Safety</p>
                            <span className="material-symbols-outlined text-walnut/30 group-hover:text-walnut transition-colors">layers</span>
                        </div>
                        <p className="text-walnut text-3xl font-bold tracking-tight">3.5x</p>
                        <div className="mt-2 text-xs text-walnut/50 font-medium">Coverage ratio</div>
                    </div>
                    {/* Model Confidence */}
                    <div className="glass-panel p-6 rounded-xl hover:bg-white/50 transition-all group duration-300">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-walnut/60 text-xs font-bold uppercase tracking-wider">Model Confidence</p>
                            <span className="material-symbols-outlined text-walnut/30 group-hover:text-walnut transition-colors">psychology</span>
                        </div>
                        <p className="text-walnut text-3xl font-bold tracking-tight">98.2%</p>
                        <div className="mt-2 text-xs text-walnut/50 font-medium">High data integrity</div>
                    </div>
                </div>

                {/* Summary Bar */}
                <div className="glass-panel p-4 lg:px-8 lg:py-5 rounded-xl flex flex-col md:flex-row justify-between items-center gap-6 md:gap-12">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="p-2 rounded-lg bg-white/40 text-walnut/70">
                            <span className="material-symbols-outlined">account_balance_wallet</span>
                        </div>
                        <div>
                            <p className="text-walnut/50 text-xs font-bold uppercase tracking-wider">Current Balance</p>
                            <p className="text-walnut text-xl font-bold">₹1.2 Cr</p>
                        </div>
                    </div>
                    <div className="hidden md:block w-px h-10 bg-walnut/10"></div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="p-2 rounded-lg bg-white/40 text-walnut/70">
                            <span className="material-symbols-outlined">payments</span>
                        </div>
                        <div>
                            <p className="text-walnut/50 text-xs font-bold uppercase tracking-wider">Monthly Revenue</p>
                            <p className="text-walnut text-xl font-bold">₹45.2 L</p>
                        </div>
                    </div>
                    <div className="hidden md:block w-px h-10 bg-walnut/10"></div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="p-2 rounded-lg bg-white/40 text-walnut/70">
                            <span className="material-symbols-outlined">timelapse</span>
                        </div>
                        <div>
                            <p className="text-walnut/50 text-xs font-bold uppercase tracking-wider">Calculated Runway</p>
                            <p className="text-walnut text-xl font-bold">18 Months</p>
                        </div>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <span className="material-symbols-outlined text-olive">check_circle</span>
                        <span className="text-olive text-sm font-semibold">Eligibility Verified</span>
                    </div>
                </div>

                {/* Loan Simulator */}
                <div className="glass-panel rounded-2xl overflow-hidden flex flex-col lg:flex-row min-h-[400px]">
                    {/* Simulator Controls */}
                    <div className="flex-1 p-6 lg:p-8 flex flex-col justify-center gap-8 border-b lg:border-b-0 lg:border-r border-white/50">
                        <div className="mb-2">
                            <h3 className="text-walnut text-xl font-bold">Loan Simulator</h3>
                            <p className="text-walnut/60 text-sm">Adjust parameters to see repayment impact.</p>
                        </div>
                        {/* Loan Amount Slider */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <label className="text-walnut text-sm font-semibold">Loan Amount</label>
                                <div className="bg-white/40 px-3 py-1 rounded text-walnut font-bold tabular-nums border border-white/60">{formatCurrency(loanAmount)}</div>
                            </div>
                            <input
                                className="w-full accent-walnut"
                                max={10000000}
                                min={500000}
                                step={100000}
                                type="range"
                                value={loanAmount}
                                onChange={(e) => setLoanAmount(Number(e.target.value))}
                            />
                            <div className="flex justify-between text-xs text-walnut/40 font-medium">
                                <span>₹5L</span>
                                <span>₹1Cr</span>
                            </div>
                        </div>
                        {/* Tenure Slider */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <label className="text-walnut text-sm font-semibold">Tenure</label>
                                <div className="bg-white/40 px-3 py-1 rounded text-walnut font-bold tabular-nums border border-white/60">{tenure} Months</div>
                            </div>
                            <input
                                className="w-full accent-walnut"
                                max={60}
                                min={6}
                                step={6}
                                type="range"
                                value={tenure}
                                onChange={(e) => setTenure(Number(e.target.value))}
                            />
                            <div className="flex justify-between text-xs text-walnut/40 font-medium">
                                <span>6 Mo</span>
                                <span>60 Mo</span>
                            </div>
                        </div>
                        {/* Interest Rate Slider */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <label className="text-walnut text-sm font-semibold">Interest Rate (p.a)</label>
                                <div className="bg-white/40 px-3 py-1 rounded text-walnut font-bold tabular-nums border border-white/60">{interestRate.toFixed(1)}%</div>
                            </div>
                            <input
                                className="w-full accent-walnut"
                                max={20}
                                min={8}
                                step={0.1}
                                type="range"
                                value={interestRate}
                                onChange={(e) => setInterestRate(Number(e.target.value))}
                            />
                            <div className="flex justify-between text-xs text-walnut/40 font-medium">
                                <span>8%</span>
                                <span>20%</span>
                            </div>
                        </div>
                    </div>

                    {/* Results Panel */}
                    <div className="flex-1 p-6 lg:p-8 bg-white/20 flex flex-col justify-center">
                        {/* EMI Display */}
                        <div className="glass-panel p-6 rounded-xl border border-white/80 shadow-lg mb-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <span className="material-symbols-outlined text-8xl text-walnut">calculate</span>
                            </div>
                            <p className="text-walnut/60 text-sm font-bold uppercase tracking-wider mb-2">Projected Monthly EMI</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-walnut text-5xl font-extrabold tracking-tight">{formatCurrency(emi)}</span>
                            </div>
                            <p className="text-walnut/50 text-xs mt-2 font-medium">Calculated reducing balance method</p>
                        </div>
                        {/* Affordability Index */}
                        <div className="mb-8">
                            <div className="flex justify-between mb-2">
                                <span className="text-walnut text-sm font-semibold">Affordability Index</span>
                                <span className="text-olive font-bold text-sm">Excellent</span>
                            </div>
                            <div className="h-4 w-full bg-walnut/5 rounded-full overflow-hidden relative">
                                <div className="absolute top-0 left-0 h-full w-[25%] bg-gradient-to-r from-olive via-yellow-200 to-red-300"></div>
                                <div className="absolute top-0 bottom-0 w-1 bg-walnut left-[25%] shadow-sm"></div>
                            </div>
                            <div className="flex justify-between mt-1 text-[10px] text-walnut/40 uppercase tracking-wider font-bold">
                                <span>Comfortable</span>
                                <span>Stretched</span>
                                <span>Critical</span>
                            </div>
                        </div>
                        {/* Impact Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg bg-walnut/5 border border-walnut/5">
                                <p className="text-walnut/50 text-xs font-bold uppercase mb-1">Runway Impact</p>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-walnut text-sm">arrow_right_alt</span>
                                    <span className="text-walnut font-bold">-0.5 Mo</span>
                                </div>
                            </div>
                            <div className="p-4 rounded-lg bg-olive/10 border border-olive/10">
                                <p className="text-walnut/50 text-xs font-bold uppercase mb-1">Risk Status</p>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-olive text-sm">verified</span>
                                    <span className="text-olive font-bold">Maintained</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CreditAssessmentPage;
