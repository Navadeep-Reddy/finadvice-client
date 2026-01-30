



const Dashboard = () => {
    return (
        <div className="relative flex min-h-screen w-full flex-row overflow-hidden bg-background-light text-walnut font-display selection:bg-olive selection:text-white">
            {/* Floating Side Navigation */}
            <aside className="sticky top-0 h-screen w-20 lg:w-64 shrink-0 p-4 lg:p-6 z-30">
                <div className="glass-panel h-full w-full rounded-2xl flex flex-col justify-between p-4 lg:p-6 transition-all duration-300">
                    {/* Header/Logo */}
                    <div className="flex flex-col gap-6 items-center lg:items-start">
                        <div className="flex gap-3 items-center w-full justify-center lg:justify-start">
                            <div className="bg-center bg-no-repeat bg-cover rounded-xl w-10 h-10 shrink-0 shadow-sm border border-white" data-alt="Abstract geometric logo in dark walnut color" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuACeFXceYBH1HA3ImrvnuaiYkNIZrHe3gVUGTF4QTDxOPXaFdj4MBGLp_ctdX1gftpiCZvYaShh50IJtFw22XPgR1biAXnTUb5xwcw73XABMk30YfncspnqdSSKjtThiiTM07rb_JjlFRJWJQZXjL0TYCIduXkQxk2ncnVPF-WXwToNwTVIQKsiBNNk-jpiQ27Q9fymxLItDbYmncR36dHyWgCZM2VCIGXPXgZlm4YFvH6hJMgEwn-Avwmq5pIMsXIT5LLLKGyu9q8")' }}></div>
                            <div className="hidden lg:flex flex-col">
                                <h1 className="text-walnut text-base font-bold leading-tight tracking-tight">Acme Inst.</h1>
                                <p className="text-walnut/60 text-xs font-medium uppercase tracking-wider">Enterprise</p>
                            </div>
                        </div>
                        {/* Navigation Links */}
                        <div className="flex flex-col gap-2 w-full mt-6">
                            <a className="group flex items-center gap-3 px-3 py-3 rounded-lg bg-white/60 shadow-sm border border-white/40 transition-all hover:bg-white hover:shadow-md hover:-translate-y-0.5" href="#">
                                <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>grid_view</span>
                                <p className="hidden lg:block text-walnut text-sm font-semibold">Dashboard</p>
                            </a>
                            <a className="group flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/40 transition-all" href="#">
                                <span className="material-symbols-outlined text-walnut/70 group-hover:text-walnut transition-colors" style={{ fontSize: '24px' }}>payments</span>
                                <p className="hidden lg:block text-walnut/70 group-hover:text-walnut text-sm font-medium">Cash Flow</p>
                            </a>
                            <a className="group flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/40 transition-all" href="#">
                                <span className="material-symbols-outlined text-walnut/70 group-hover:text-walnut transition-colors" style={{ fontSize: '24px' }}>monitoring</span>
                                <p className="hidden lg:block text-walnut/70 group-hover:text-walnut text-sm font-medium">Intelligence</p>
                            </a>
                            <a className="group flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/40 transition-all" href="#">
                                <span className="material-symbols-outlined text-walnut/70 group-hover:text-walnut transition-colors" style={{ fontSize: '24px' }}>description</span>
                                <p className="hidden lg:block text-walnut/70 group-hover:text-walnut text-sm font-medium">Reports</p>
                            </a>
                        </div>
                    </div>
                    {/* Bottom Actions */}
                    <div className="flex flex-col gap-2">
                        <a className="group flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/40 transition-all" href="#">
                            <span className="material-symbols-outlined text-walnut/70 group-hover:text-walnut transition-colors" style={{ fontSize: '24px' }}>settings</span>
                            <p className="hidden lg:block text-walnut/70 group-hover:text-walnut text-sm font-medium">Settings</p>
                        </a>
                    </div>
                </div>
            </aside>
            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 p-4 lg:p-6 lg:pl-0 gap-6 lg:gap-8 overflow-y-auto h-screen">
                {/* Header */}
                <header className="flex flex-wrap justify-between items-end gap-6 px-2">
                    <div className="flex flex-col gap-2">
                        <p className="text-walnut text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight">Welcome back, Acme Corp</p>
                        <div className="flex items-center gap-2 text-walnut/60">
                            <span className="material-symbols-outlined text-sm">schedule</span>
                            <p className="text-sm font-medium tracking-wide uppercase">October 24, 2023 • 09:41 AM</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="glass-panel px-4 py-2.5 rounded-lg text-sm font-semibold text-walnut hover:bg-white/60 transition-all flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">download</span>
                            Export Data
                        </button>
                        <button className="btn-liquid px-6 py-2.5 rounded-lg text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">bolt</span>
                            Execute Transfer
                        </button>
                    </div>
                </header>
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Stat Card 1 */}
                    <div className="glass-panel p-6 rounded-xl hover:bg-white/50 transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-white/40 rounded-lg text-walnut group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined block">account_balance_wallet</span>
                            </div>
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-olive/10 text-olive text-xs font-bold">
                                <span className="material-symbols-outlined text-sm">trending_up</span>
                                +12.5%
                            </span>
                        </div>
                        <p className="text-walnut/60 text-sm font-medium mb-1">Current Liquidity</p>
                        <p className="text-walnut text-3xl font-bold tracking-tight">$2,450,000</p>
                    </div>
                    {/* Stat Card 2 */}
                    <div className="glass-panel p-6 rounded-xl hover:bg-white/50 transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-white/40 rounded-lg text-walnut group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined block">local_fire_department</span>
                            </div>
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-olive/10 text-olive text-xs font-bold">
                                <span className="material-symbols-outlined text-sm">trending_up</span>
                                +2.1%
                            </span>
                        </div>
                        <p className="text-walnut/60 text-sm font-medium mb-1">Projected Burn</p>
                        <p className="text-walnut text-3xl font-bold tracking-tight">$45,200<span className="text-lg text-walnut/40 font-normal">/mo</span></p>
                    </div>
                    {/* Stat Card 3 */}
                    <div className="glass-panel p-6 rounded-xl hover:bg-white/50 transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-white/40 rounded-lg text-walnut group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined block">credit_card</span>
                            </div>
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-600 text-xs font-bold">
                                <span className="material-symbols-outlined text-sm">trending_down</span>
                                -1.5%
                            </span>
                        </div>
                        <p className="text-walnut/60 text-sm font-medium mb-1">Credit Utilization</p>
                        <p className="text-walnut text-3xl font-bold tracking-tight">15.4%</p>
                    </div>
                </div>
                {/* Dashboard Grid: Charts + Feed */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 flex-1">
                    {/* Main Chart Section (2/3 width) */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <div className="glass-panel p-6 lg:p-8 rounded-2xl flex-1 flex flex-col justify-between min-h-[500px]">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
                                <div>
                                    <h2 className="text-walnut text-lg font-bold mb-1">Cash Velocity & Spend Volume</h2>
                                    <p className="text-walnut/60 text-sm">Tracking total output against projected liquidity.</p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <p className="thermal-text text-4xl lg:text-5xl font-black tracking-tighter leading-none">$1.2M</p>
                                    <p className="text-walnut/50 text-xs font-medium uppercase tracking-wider mt-1">Total Volume YTD</p>
                                </div>
                            </div>
                            {/* Chart Container */}
                            <div className="relative w-full flex-1 min-h-[300px]">
                                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 300">
                                    <defs>
                                        {/* Thermal Glow Gradient Definition */}
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
                                    <line stroke="rgba(72, 64, 60, 0.05)" strokeWidth="1" x1="0" x2="800" y1="225" y2="225"></line>
                                    <line stroke="rgba(72, 64, 60, 0.05)" strokeWidth="1" x1="0" x2="800" y1="150" y2="150"></line>
                                    <line stroke="rgba(72, 64, 60, 0.05)" strokeWidth="1" x1="0" x2="800" y1="75" y2="75"></line>
                                    {/* Area Fill */}
                                    <path d="M0,220 C100,220 150,150 250,160 C350,170 400,100 500,80 C600,60 650,140 700,120 C750,100 780,40 800,50 L800,300 L0,300 Z" fill="url(#thermalFill)"></path>
                                    {/* Main Line */}
                                    <path d="M0,220 C100,220 150,150 250,160 C350,170 400,100 500,80 C600,60 650,140 700,120 C750,100 780,40 800,50" fill="none" filter="url(#glow)" stroke="url(#thermalGradient)" strokeLinecap="round" strokeWidth="4"></path>
                                    {/* Data Point Example */}
                                    <circle cx="500" cy="80" fill="#F0EEE9" r="6" stroke="#8A2BE2" strokeWidth="3"></circle>
                                </svg>
                                {/* Tooltip mockup positioned near data point */}
                                <div className="absolute top-[18%] left-[62%] -translate-x-1/2 -translate-y-full bg-white/90 backdrop-blur-md p-3 rounded-lg shadow-glass border border-white/50 mb-2 pointer-events-none">
                                    <p className="text-xs font-bold text-walnut mb-0.5">Aug 14, 2023</p>
                                    <p className="text-sm text-primary font-bold">$420k Spend</p>
                                </div>
                            </div>
                            {/* X Axis Labels */}
                            <div className="flex justify-between px-2 mt-4 text-walnut/40 text-xs font-semibold uppercase tracking-wider">
                                <span>May</span>
                                <span>Jun</span>
                                <span>Jul</span>
                                <span>Aug</span>
                                <span>Sep</span>
                                <span>Oct</span>
                            </div>
                        </div>
                        {/* Secondary Metrics Row within the main column */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="glass-panel p-5 rounded-xl flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-olive/10 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-olive">check_circle</span>
                                </div>
                                <div>
                                    <p className="text-walnut/50 text-xs font-bold uppercase tracking-wider">System Status</p>
                                    <p className="text-walnut font-bold text-lg">All Systems Operational</p>
                                </div>
                            </div>
                            <div className="glass-panel p-5 rounded-xl flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-primary">pending</span>
                                </div>
                                <div>
                                    <p className="text-walnut/50 text-xs font-bold uppercase tracking-wider">Pending Approvals</p>
                                    <p className="text-walnut font-bold text-lg">3 Transactions</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Intelligence Feed (1/3 width) */}
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h2 className="text-walnut text-xl font-bold tracking-tight">Intelligence Feed</h2>
                            <button className="text-primary text-sm font-semibold hover:underline">View All</button>
                        </div>
                        <div className="flex flex-col gap-4 flex-1">
                            {/* Feed Item 1 */}
                            <div className="glass-panel p-5 rounded-xl hover:-translate-y-1 hover:bg-white/60 transition-all duration-300 cursor-pointer relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-1 h-full bg-primary/30 group-hover:bg-primary transition-colors"></div>
                                <div className="flex justify-between items-start mb-2">
                                    <span className="px-2 py-0.5 rounded border border-walnut/10 bg-white/30 text-[10px] font-bold uppercase tracking-wider text-walnut/60">Macro</span>
                                    <span className="text-walnut/40 text-xs">2h ago</span>
                                </div>
                                <h3 className="text-walnut font-bold text-base leading-snug mb-2 group-hover:text-primary transition-colors">Fed Rates Adjustment: Impact on Credit Lines</h3>
                                <p className="text-walnut/60 text-sm leading-relaxed line-clamp-2">New federal policies may affect short-term liquidity options for enterprise accounts starting Q4.</p>
                            </div>
                            {/* Feed Item 2 */}
                            <div className="glass-panel p-5 rounded-xl hover:-translate-y-1 hover:bg-white/60 transition-all duration-300 cursor-pointer relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-1 h-full bg-olive/30 group-hover:bg-olive transition-colors"></div>
                                <div className="flex justify-between items-start mb-2">
                                    <span className="px-2 py-0.5 rounded border border-walnut/10 bg-white/30 text-[10px] font-bold uppercase tracking-wider text-walnut/60">Market</span>
                                    <span className="text-walnut/40 text-xs">5h ago</span>
                                </div>
                                <h3 className="text-walnut font-bold text-base leading-snug mb-2 group-hover:text-olive transition-colors">Sector Analysis: Tech Growth Q3</h3>
                                <p className="text-walnut/60 text-sm leading-relaxed line-clamp-2">Technology sector shows resilience despite broader market volatility. SaaS verticals outperform.</p>
                            </div>
                            {/* Feed Item 3 */}
                            <div className="glass-panel p-5 rounded-xl hover:-translate-y-1 hover:bg-white/60 transition-all duration-300 cursor-pointer relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-1 h-full bg-walnut/10 group-hover:bg-walnut/40 transition-colors"></div>
                                <div className="flex justify-between items-start mb-2">
                                    <span className="px-2 py-0.5 rounded border border-walnut/10 bg-white/30 text-[10px] font-bold uppercase tracking-wider text-walnut/60">Internal</span>
                                    <span className="text-walnut/40 text-xs">1d ago</span>
                                </div>
                                <h3 className="text-walnut font-bold text-base leading-snug mb-2">Q4 Budget Allocation Review</h3>
                                <p className="text-walnut/60 text-sm leading-relaxed line-clamp-2">Please review the proposed allocation for the upcoming quarter before Friday's board meeting.</p>
                            </div>
                            {/* Simplified Visual Filler for "More" */}
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
