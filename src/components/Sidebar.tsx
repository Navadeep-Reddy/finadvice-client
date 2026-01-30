
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar: React.FC = () => {
    const location = useLocation();
    const { signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <aside className="sticky top-0 h-screen w-20 lg:w-64 shrink-0 p-4 lg:p-6 z-30">
            <div className="glass-panel h-full w-full rounded-2xl flex flex-col justify-between p-4 lg:p-6 transition-all duration-300">
                <div className="flex flex-col gap-6 items-center lg:items-start">
                    <div className="flex gap-3 items-center w-full justify-center lg:justify-start">
                        <div
                            className="bg-center bg-no-repeat bg-cover rounded-xl w-10 h-10 shrink-0 shadow-sm border border-white"
                            data-alt="Abstract geometric logo in dark walnut color"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuACeFXceYBH1HA3ImrvnuaiYkNIZrHe3gVUGTF4QTDxOPXaFdj4MBGLp_ctdX1gftpiCZvYaShh50IJtFw22XPgR1biAXnTUb5xwcw73XABMk30YfncspnqdSSKjtThiiTM07rb_JjlFRJWJQZXjL0TYCIduXkQxk2ncnVPF-WXwToNwTVIQKsiBNNk-jpiQ27Q9fymxLItDbYmncR36dHyWgCZM2VCIGXPXgZlm4YFvH6hJMgEwn-Avwmq5pIMsXIT5LLLKGyu9q8")' }}
                        />
                        <div className="hidden lg:flex flex-col">
                            <h1 className="text-walnut text-base font-bold leading-tight tracking-tight">FinAdvice</h1>
                            <p className="text-walnut/60 text-xs font-medium uppercase tracking-wider">SME Edition</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full mt-6">
                        <Link to="/" className={`group flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${location.pathname === '/' ? 'bg-white/60 shadow-sm border border-white/40 hover:bg-white hover:shadow-md hover:-translate-y-0.5' : 'hover:bg-white/40'}`}>
                            <span className={`material-symbols-outlined transition-colors ${location.pathname === '/' ? 'text-primary' : 'text-walnut/70 group-hover:text-walnut'}`} style={{ fontSize: '24px' }}>home</span>
                            <p className={`hidden lg:block text-sm font-medium ${location.pathname === '/' ? 'text-walnut font-semibold' : 'text-walnut/70 group-hover:text-walnut'}`}>Home</p>
                        </Link>
                        <Link to="/dashboard" className={`group flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${location.pathname === '/dashboard' ? 'bg-white/60 shadow-sm border border-white/40 hover:bg-white hover:shadow-md hover:-translate-y-0.5' : 'hover:bg-white/40'}`}>
                            <span className={`material-symbols-outlined transition-colors ${location.pathname === '/dashboard' ? 'text-primary' : 'text-walnut/70 group-hover:text-walnut'}`} style={{ fontSize: '24px' }}>grid_view</span>
                            <p className={`hidden lg:block text-sm font-medium ${location.pathname === '/dashboard' ? 'text-walnut font-semibold' : 'text-walnut/70 group-hover:text-walnut'}`}>Dashboard</p>
                        </Link>
                        <Link to="/decision" className={`group flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${location.pathname === '/decision' ? 'bg-white/60 shadow-sm border border-white/40 hover:bg-white hover:shadow-md hover:-translate-y-0.5' : 'hover:bg-white/40'}`}>
                            <span className={`material-symbols-outlined transition-colors ${location.pathname === '/decision' ? 'text-primary' : 'text-walnut/70 group-hover:text-walnut'}`} style={{ fontSize: '24px' }}>psychology</span>
                            <p className={`hidden lg:block text-sm font-medium ${location.pathname === '/decision' ? 'text-walnut font-semibold' : 'text-walnut/70 group-hover:text-walnut'}`}>Decision Maker</p>
                        </Link>
                        <Link to="/transactions" className={`group flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${location.pathname === '/transactions' ? 'bg-white/60 shadow-sm border border-white/40 hover:bg-white hover:shadow-md hover:-translate-y-0.5' : 'hover:bg-white/40'}`}>
                            <span className={`material-symbols-outlined transition-colors ${location.pathname === '/transactions' ? 'text-primary' : 'text-walnut/70 group-hover:text-walnut'}`} style={{ fontSize: '24px' }}>receipt_long</span>
                            <p className={`hidden lg:block text-sm font-medium ${location.pathname === '/transactions' ? 'text-walnut font-semibold' : 'text-walnut/70 group-hover:text-walnut'}`}>Transactions</p>
                        </Link>
                        <a className="group flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/40 transition-all" href="#">
                            <span className="material-symbols-outlined text-walnut/70 group-hover:text-walnut transition-colors" style={{ fontSize: '24px' }}>credit_score</span>
                            <p className="hidden lg:block text-walnut/70 group-hover:text-walnut text-sm font-medium">Credit Manager</p>
                        </a>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <a className="group flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/40 transition-all" href="#">
                        <span className="material-symbols-outlined text-walnut/70 group-hover:text-walnut transition-colors" style={{ fontSize: '24px' }}>settings</span>
                        <p className="hidden lg:block text-walnut/70 group-hover:text-walnut text-sm font-medium">Settings</p>
                    </a>
                    <button onClick={handleSignOut} className="group flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-red-500/10 transition-all w-full text-left">
                        <span className="material-symbols-outlined text-walnut/70 group-hover:text-red-500 transition-colors" style={{ fontSize: '24px' }}>logout</span>
                        <p className="hidden lg:block text-walnut/70 group-hover:text-red-500 text-sm font-medium">Sign Out</p>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
