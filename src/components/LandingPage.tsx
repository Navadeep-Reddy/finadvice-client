import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
    return (
        <div className="bg-background-light text-walnut font-display selection:bg-olive selection:text-white overflow-x-hidden min-h-screen">
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
                <div className="glass-panel max-w-7xl mx-auto rounded-xl px-6 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-center bg-no-repeat bg-cover rounded-lg w-8 h-8 shrink-0 shadow-sm border border-white" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuACeFXceYBH1HA3ImrvnuaiYkNIZrHe3gVUGTF4QTDxOPXaFdj4MBGLp_ctdX1gftpiCZvYaShh50IJtFw22XPgR1biAXnTUb5xwcw73XABMk30YfncspnqdSSKjtThiiTM07rb_JjlFRJWJQZXjL0TYCIduXkQxk2ncnVPF-WXwToNwTVIQKsiBNNk-jpiQ27Q9fymxLItDbYmncR36dHyWgCZM2VCIGXPXgZlm4YFvH6hJMgEwn-Avwmq5pIMsXIT5LLLKGyu9q8")' }}></div>
                        <span className="text-walnut font-bold text-lg tracking-tight">FinAdvice</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-walnut/80">
                        <a className="hover:text-primary transition-colors" href="#">Solutions</a>
                        <a className="hover:text-primary transition-colors" href="#">Platform</a>
                        <a className="hover:text-primary transition-colors" href="#">Intelligence</a>
                        <a className="hover:text-primary transition-colors" href="#">Company</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <a className="text-walnut text-sm font-semibold hover:text-primary transition-colors" href="#">Login</a>
                        <button className="btn-liquid px-5 py-2 rounded-lg text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all active:scale-95 cursor-pointer">
                            Request Access
                        </button>
                    </div>
                </div>
            </nav>
            <section className="relative pt-32 lg:pt-48 pb-20 lg:pb-32 px-6 overflow-hidden bg-grid">
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/40 border border-white/60 backdrop-blur-sm mb-8 animate-fade-in-up">
                        <span className="w-2 h-2 rounded-full bg-olive animate-pulse"></span>
                        <span className="text-xs font-bold text-walnut/70 uppercase tracking-widest">SME Financial Intelligence</span>
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black text-walnut tracking-tighter mb-6 leading-[0.9]">
                        Real-time <br />
                        <span className="thermal-text shadow-glow">Decision Making</span>
                    </h1>
                    <p className="text-xl text-walnut/70 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                        Design and build a scalable, secure, and intelligent FinTech platform that enables real-time financial decision-making for small businesses.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-20">
                        <Link to="/dashboard" className="btn-liquid px-8 py-4 rounded-xl text-white text-base font-bold shadow-xl hover:shadow-2xl transition-all active:scale-95 flex items-center gap-2 cursor-pointer">
                            Go To Dashboard
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </Link>
                        <button className="glass-panel px-8 py-4 rounded-xl text-walnut text-base font-bold hover:bg-white/60 transition-all flex items-center gap-2 cursor-pointer">
                            <span className="material-symbols-outlined text-walnut/60">play_circle</span>
                            Watch Platform Tour
                        </button>
                    </div>
                    <div className="perspective-1000 mt-12 w-full max-w-5xl mx-auto px-4">
                        <div className="rotate-3d-mockup glass-panel p-2 rounded-2xl shadow-2xl border border-white/50 bg-gradient-to-br from-white/40 to-white/10">
                            <div className="bg-background-light rounded-xl overflow-hidden border border-white/20 relative">
                                <div className="h-8 bg-white/50 border-b border-walnut/5 flex items-center px-4 gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-400/50"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/50"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-400/50"></div>
                                    </div>
                                </div>
                                <div className="p-6 grid grid-cols-12 gap-6 opacity-90">
                                    <div className="col-span-8 bg-white/50 rounded-lg h-64 border border-white/60 p-4 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent z-10"></div>
                                        <div className="flex justify-between items-end mb-4">
                                            <div>
                                                <div className="h-2 w-24 bg-walnut/10 rounded mb-2"></div>
                                                <div className="h-8 w-32 bg-walnut/20 rounded"></div>
                                            </div>
                                            <div className="h-6 w-16 bg-olive/20 rounded-full"></div>
                                        </div>
                                        <svg className="w-full h-40 overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 150">
                                            <path d="M0,120 C50,120 80,80 120,90 C160,100 200,40 250,50 C300,60 350,20 400,30" fill="none" stroke="url(#thermalGradientMock)" strokeWidth="3"></path>
                                            <defs>
                                                <linearGradient id="thermalGradientMock" x1="0%" x2="100%" y1="0%" y2="0%">
                                                    <stop offset="0%" style={{ stopColor: '#8A2BE2', stopOpacity: 1 }}></stop>
                                                    <stop offset="100%" style={{ stopColor: '#FFA500', stopOpacity: 1 }}></stop>
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                    </div>
                                    <div className="col-span-4 flex flex-col gap-4">
                                        <div className="bg-white/50 rounded-lg h-28 border border-white/60 p-4">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10"></div>
                                                <div className="h-3 w-20 bg-walnut/10 rounded"></div>
                                            </div>
                                            <div className="h-2 w-full bg-walnut/5 rounded mb-2"></div>
                                            <div className="h-2 w-2/3 bg-walnut/5 rounded"></div>
                                        </div>
                                        <div className="bg-white/50 rounded-lg h-32 border border-white/60 p-4">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-8 h-8 rounded-full bg-olive/10"></div>
                                                <div className="h-3 w-20 bg-walnut/10 rounded"></div>
                                            </div>
                                            <div className="h-2 w-full bg-walnut/5 rounded mb-2"></div>
                                            <div className="h-2 w-3/4 bg-walnut/5 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/0 via-white/10 to-transparent pointer-events-none"></div>
                        </div>
                    </div>
                </div>
                <div className="absolute top-1/4 -left-64 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] mix-blend-multiply filter pointer-events-none"></div>
                <div className="absolute bottom-0 -right-64 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[100px] mix-blend-multiply filter pointer-events-none"></div>
            </section>
            <section className="py-24 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16 text-center lg:text-left">
                        <h2 className="text-4xl font-bold text-walnut mb-4 tracking-tight">Built for Small Business Growth</h2>
                        <p className="text-xl text-walnut/60 max-w-2xl">Financial clarity for SMEs. Navigate uncertainty with AI-powered cash flow forecasting and sector-specific intelligence.</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 auto-rows-[minmax(300px,auto)]">
                        <div className="lg:col-span-7 glass-panel rounded-2xl p-8 lg:p-12 relative overflow-hidden group hover:bg-white/50 transition-colors">
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div>
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                                        <span className="material-symbols-outlined text-3xl">trending_up</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-walnut mb-3">Burn Rate Analysis</h3>
                                    <p className="text-walnut/70 leading-relaxed max-w-md">Pivot from rigid rules to dynamic cash flow forecasting. Know your runway and optimize spending based on real-time accounts receivable.</p>
                                </div>
                                <div className="mt-8">
                                    <div className="inline-flex items-center gap-2 text-olive font-bold text-sm bg-olive/10 px-3 py-1 rounded-full">
                                        <span className="material-symbols-outlined text-sm">check_circle</span>
                                        <span className="uppercase tracking-wider">Predictive Modeling</span>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-1/2 -right-20 transform -translate-y-1/2 w-64 h-64 opacity-50 group-hover:opacity-80 transition-opacity">
                                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,79.6,-46.9C87.4,-34.7,90.1,-20.4,85.8,-7.1C81.5,6.2,70.2,18.5,60.5,29.2C50.8,39.9,42.7,49,32.8,54.7C22.9,60.4,11.2,62.7,-1.2,64.8C-13.6,66.9,-29.3,68.8,-41.8,64.2C-54.3,59.6,-63.6,48.5,-70.7,36.2C-77.8,23.9,-82.7,10.4,-81.4,-2.5C-80,-15.4,-72.4,-27.7,-63,-38.2C-53.6,-48.7,-42.4,-57.4,-30.3,-65.9C-18.2,-74.4,-5.2,-82.7,4.2,-89.9L13.6,-97.1Z" fill="#1152d4" opacity="0.1" transform="translate(100 100) scale(1.1)"></path>
                                </svg>
                            </div>
                        </div>
                        <div className="lg:col-span-5 glass-panel rounded-2xl p-8 lg:p-12 relative overflow-hidden group hover:bg-white/50 transition-colors">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-olive/5"></div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 text-purple-600">
                                    <span className="material-symbols-outlined text-3xl">psychology</span>
                                </div>
                                <h3 className="text-2xl font-bold text-walnut mb-3">Explainable Outcomes</h3>
                                <p className="text-walnut/70 leading-relaxed mb-8">AI that explains itself. Understand the 'why' behind every financial suggestion, from sector inflation to supply chain volatility.</p>
                                <div className="glass-panel p-4 rounded-lg border-l-4 border-olive">
                                    <p className="text-xs font-bold text-walnut/50 uppercase mb-1">Recommendation</p>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-walnut font-bold">Delay Equipment Purchase</span>
                                        <span className="bg-olive/20 text-olive text-xs font-bold px-2 py-0.5 rounded">High Confidence</span>
                                    </div>
                                    <p className="text-xs text-walnut/60">Reasoning: Projected seasonal inventory costs will reduce liquidity by 40% next month.</p>
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-12 glass-panel rounded-2xl p-8 lg:p-12 flex flex-col lg:flex-row items-center gap-12 group hover:bg-white/50 transition-colors">
                            <div className="flex-1">
                                <div className="w-12 h-12 rounded-xl bg-walnut/10 flex items-center justify-center mb-6 text-walnut">
                                    <span className="material-symbols-outlined text-3xl">lock</span>
                                </div>
                                <h3 className="text-2xl font-bold text-walnut mb-3">Privacy & Compliance</h3>
                                <p className="text-walnut/70 leading-relaxed text-lg mb-6">Built on the Account Aggregator framework. Privacy-first architecture where PII is stripped before processing. Secure, regulatory compliant, and safe.</p>
                                <div className="flex flex-wrap gap-3">
                                    <span className="px-4 py-2 rounded-lg bg-white/50 border border-white/60 text-walnut/80 text-sm font-semibold">Account Aggregator</span>
                                    <span className="px-4 py-2 rounded-lg bg-white/50 border border-white/60 text-walnut/80 text-sm font-semibold">PII Redaction</span>
                                    <span className="px-4 py-2 rounded-lg bg-white/50 border border-white/60 text-walnut/80 text-sm font-semibold">Local LLMs</span>
                                </div>
                            </div>
                            <div className="w-full lg:w-1/3 flex justify-center">
                                <div className="relative w-48 h-48">
                                    <div className="absolute inset-0 border-4 border-walnut/10 rounded-full animate-[spin_10s_linear_infinite]"></div>
                                    <div className="absolute inset-4 border-4 border-dashed border-walnut/20 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-6xl text-walnut/30">shield</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-12 border-y border-white/40 bg-white/20 backdrop-blur-sm overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-center text-sm font-bold text-walnut/40 uppercase tracking-widest mb-8">Integrated with Major Financial Data Sources</p>
                    <div className="flex flex-wrap justify-center gap-12 lg:gap-20 opacity-60 grayscale mix-blend-multiply">
                        <span className="text-2xl font-black text-walnut/60">BANKING APIs</span>
                        <span className="text-2xl font-black text-walnut/60">REGULATORY SIGNALS</span>
                        <span className="text-2xl font-black text-walnut/60">MARKET INDICES</span>
                        <span className="text-2xl font-black text-walnut/60">SUPPLY CHAIN</span>
                        <span className="text-2xl font-black text-walnut/60">EXCHANGE RATES</span>
                    </div>
                </div>
            </section>
            <section className="py-32 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <div className="glass-panel p-12 lg:p-20 rounded-3xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-purple-500 to-orange-400"></div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-walnut mb-6">Ready to optimize your business?</h2>
                        <p className="text-xl text-walnut/60 max-w-2xl mx-auto mb-10">Join the platform redefining SME financial decision making.</p>
                        <form className="max-w-md mx-auto flex flex-col gap-4">
                            <div className="relative">
                                <input className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/60 border border-white/60 focus:ring-2 focus:ring-primary/20 focus:border-primary text-walnut placeholder-walnut/40 outline-none transition-all shadow-inner" placeholder="Business Email Address" type="email" />
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-walnut/40">mail</span>
                            </div>
                            <button className="btn-liquid w-full py-4 rounded-xl text-white font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 cursor-pointer" type="submit">
                                Get Started
                            </button>
                        </form>
                        <p className="mt-4 text-xs text-walnut/40">Secure access. Verification required.</p>
                    </div>
                </div>
            </section>
            <footer className="pb-12 px-6">
                <div className="max-w-7xl mx-auto glass-panel p-8 lg:p-12 rounded-2xl flex flex-col lg:flex-row justify-between gap-12">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-6 h-6 rounded bg-walnut"></div>
                            <span className="text-walnut font-bold text-lg">FinAdvice</span>
                        </div>
                        <p className="text-walnut/60 text-sm max-w-xs">Intelligent financial decision making for the modern business.</p>
                        <div className="flex gap-4 mt-2">
                            <a className="text-walnut/40 hover:text-walnut transition-colors" href="#"><span className="material-symbols-outlined">api</span></a>
                            <a className="text-walnut/40 hover:text-walnut transition-colors" href="#"><span className="material-symbols-outlined">hub</span></a>
                            <a className="text-walnut/40 hover:text-walnut transition-colors" href="#"><span className="material-symbols-outlined">public</span></a>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-24">
                        <div className="flex flex-col gap-4">
                            <h4 className="text-walnut font-bold text-sm uppercase tracking-wider">Product</h4>
                            <a className="text-walnut/60 hover:text-primary transition-colors text-sm" href="#">Features</a>
                            <a className="text-walnut/60 hover:text-primary transition-colors text-sm" href="#">Data Sources</a>
                            <a className="text-walnut/60 hover:text-primary transition-colors text-sm" href="#">Security</a>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h4 className="text-walnut font-bold text-sm uppercase tracking-wider">Company</h4>
                            <a className="text-walnut/60 hover:text-primary transition-colors text-sm" href="#">About</a>
                            <a className="text-walnut/60 hover:text-primary transition-colors text-sm" href="#">Careers</a>
                            <a className="text-walnut/60 hover:text-primary transition-colors text-sm" href="#">Contact</a>
                        </div>
                        <div className="flex flex-col gap-4 col-span-2 lg:col-span-1">
                            <h4 className="text-walnut font-bold text-sm uppercase tracking-wider">Legal</h4>
                            <a className="text-walnut/60 hover:text-primary transition-colors text-sm" href="#">Privacy Policy</a>
                            <a className="text-walnut/60 hover:text-primary transition-colors text-sm" href="#">Terms of Service</a>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-8 flex justify-between items-center px-4">
                    <p className="text-walnut/40 text-xs">© 2024 FinAdvice Inc. All rights reserved.</p>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="text-walnut/40 text-xs font-mono">System Operational</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
