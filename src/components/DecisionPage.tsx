
import React from 'react';
import Sidebar from './Sidebar';

const DecisionPage: React.FC = () => {
    return (
        <div className="relative flex min-h-screen w-full flex-row bg-background-light text-walnut font-display selection:bg-olive selection:text-white overflow-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 p-4 lg:p-6 lg:pl-0 gap-6 overflow-y-auto h-screen relative">
                <header className="flex flex-col gap-1 px-2">
                    <div className="flex items-center gap-3">
                        <h1 className="text-walnut text-2xl lg:text-3xl font-extrabold leading-tight tracking-tight">FinAdvice Assistant</h1>
                    </div>
                    <p className="text-walnut/60 text-sm">Ask complex questions about your liquidity, forecast models, or market impact.</p>
                </header>

                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
                    <button className="glass-panel p-4 rounded-xl flex flex-col items-start gap-3 hover:bg-white/60 hover:-translate-y-1 transition-all group text-left">
                        <div className="p-2 rounded-lg bg-olive/10 group-hover:bg-olive/20 transition-colors">
                            <span className="material-symbols-outlined text-olive">trending_up</span>
                        </div>
                        <div>
                            <p className="text-walnut font-bold text-sm">Forecast Q4 Revenue</p>
                            <p className="text-walnut/50 text-xs mt-0.5">Based on current trajectory</p>
                        </div>
                    </button>
                    <button className="glass-panel p-4 rounded-xl flex flex-col items-start gap-3 hover:bg-white/60 hover:-translate-y-1 transition-all group text-left">
                        <div className="p-2 rounded-lg bg-olive/10 group-hover:bg-olive/20 transition-colors">
                            <span className="material-symbols-outlined text-olive">local_fire_department</span>
                        </div>
                        <div>
                            <p className="text-walnut font-bold text-sm">Analyze Burn Rate</p>
                            <p className="text-walnut/50 text-xs mt-0.5">Compare to industry avg</p>
                        </div>
                    </button>
                    <button className="glass-panel p-4 rounded-xl flex flex-col items-start gap-3 hover:bg-white/60 hover:-translate-y-1 transition-all group text-left">
                        <div className="p-2 rounded-lg bg-olive/10 group-hover:bg-olive/20 transition-colors">
                            <span className="material-symbols-outlined text-olive">pie_chart</span>
                        </div>
                        <div>
                            <p className="text-walnut font-bold text-sm">Expense Breakdown</p>
                            <p className="text-walnut/50 text-xs mt-0.5">Categorize last 30 days</p>
                        </div>
                    </button>
                    <button className="glass-panel p-4 rounded-xl flex flex-col items-start gap-3 hover:bg-white/60 hover:-translate-y-1 transition-all group text-left">
                        <div className="p-2 rounded-lg bg-olive/10 group-hover:bg-olive/20 transition-colors">
                            <span className="material-symbols-outlined text-olive">psychology</span>
                        </div>
                        <div>
                            <p className="text-walnut font-bold text-sm">Risk Assessment</p>
                            <p className="text-walnut/50 text-xs mt-0.5">Evaluate current exposure</p>
                        </div>
                    </button>
                </section>

                <section className="flex-1 glass-panel rounded-2xl flex flex-col overflow-hidden mx-2 relative">
                    <div className="flex-1 overflow-y-auto p-6 lg:p-8 flex flex-col gap-6 scroll-smooth">
                        {/* Assistant Greeting */}
                        <div className="flex gap-4 max-w-3xl">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8A2BE2] to-[#FFA500] flex items-center justify-center shrink-0 shadow-lg text-white">
                                <span className="material-symbols-outlined text-xl">auto_awesome</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-xs font-bold text-walnut/70 uppercase tracking-wider">Assistant</span>
                                    <span className="text-[10px] text-walnut/40">Just now</span>
                                </div>
                                <div className="glass-panel-clear p-5 rounded-2xl rounded-tl-none text-walnut leading-relaxed shadow-sm">
                                    <p>Good morning. I am your FinAdvice Assistant. I can help you with complex questions about your liquidity, forecast models, or market impact. How can I help you today?</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Input Area */}
                    <div className="p-6 pt-2 bg-gradient-to-t from-white/40 via-white/20 to-transparent">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#8A2BE2] to-[#FFA500] rounded-xl opacity-0 group-focus-within:opacity-20 transition-opacity duration-500 blur-lg -z-10"></div>
                            <div className="flex items-end gap-2 bg-white/60 backdrop-blur-xl border border-white/80 rounded-xl p-2 shadow-lg hover:shadow-xl transition-all duration-300">
                                <button className="p-2.5 rounded-lg text-walnut/40 hover:text-walnut hover:bg-white/50 transition-colors self-end mb-0.5">
                                    <span className="material-symbols-outlined block">attach_file</span>
                                </button>
                                <textarea
                                    className="w-full bg-transparent border-none p-3 text-walnut placeholder-walnut/40 focus:ring-0 resize-none max-h-32 min-h-[48px] text-base leading-relaxed"
                                    placeholder="Ask about liquidity, run scenarios, or analyze trends..."
                                    rows={1}
                                ></textarea>
                                <div className="flex items-center gap-1 self-end mb-0.5">
                                    <button className="p-2.5 rounded-lg text-walnut/40 hover:text-walnut hover:bg-white/50 transition-colors">
                                        <span className="material-symbols-outlined block">mic</span>
                                    </button>
                                    <button className="p-2.5 rounded-lg bg-walnut text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all">
                                        <span className="material-symbols-outlined block text-[20px]">arrow_upward</span>
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-center mt-3">
                                <p className="text-[10px] text-walnut/40 font-medium tracking-wide uppercase">AI-generated insights may vary. Verify critical financial data.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default DecisionPage;
