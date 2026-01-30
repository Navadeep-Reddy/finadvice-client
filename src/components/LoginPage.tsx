import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await signIn(username, password);
            if (error) {
                setError(error.message);
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError('An unexpected error occurred');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-light text-walnut font-display selection:bg-olive selection:text-white overflow-hidden min-h-screen flex items-center justify-center p-4 relative">
            {/* Background Elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full bg-white/40 blur-[120px] pointer-events-none mix-blend-overlay"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[100px] pointer-events-none"></div>

            <div className="w-full max-w-[500px] relative z-10">
                <div className="glass-panel rounded-3xl p-10 md:p-14 shadow-2xl flex flex-col gap-10 border border-white/80">
                    <div className="flex flex-col items-center text-center">
                        <div
                            className="bg-center bg-no-repeat bg-cover rounded-xl w-16 h-16 shrink-0 shadow-sm border border-white mb-6"
                            data-alt="Abstract geometric logo in dark walnut color"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuACeFXceYBH1HA3ImrvnuaiYkNIZrHe3gVUGTF4QTDxOPXaFdj4MBGLp_ctdX1gftpiCZvYaShh50IJtFw22XPgR1biAXnTUb5xwcw73XABMk30YfncspnqdSSKjtThiiTM07rb_JjlFRJWJQZXjL0TYCIduXkQxk2ncnVPF-WXwToNwTVIQKsiBNNk-jpiQ27Q9fymxLItDbYmncR36dHyWgCZM2VCIGXPXgZlm4YFvH6hJMgEwn-Avwmq5pIMsXIT5LLLKGyu9q8")' }}
                        ></div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-walnut mb-2">Institutional Access</h1>
                        <p className="text-walnut/60 text-base font-medium">Sign in to your enterprise account</p>
                    </div>

                    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-walnut/60 ml-1" htmlFor="username">Username</label>
                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-walnut/40 group-focus-within:text-primary transition-colors duration-300">person</span>
                                <input
                                    className="w-full bg-white/70 border border-white text-walnut placeholder-walnut/30 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/10 focus:bg-white/90 transition-all duration-300 shadow-sm text-sm font-medium"
                                    id="username"
                                    placeholder="Enter your username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-walnut/60 ml-1" htmlFor="password">Password</label>
                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-walnut/40 group-focus-within:text-primary transition-colors duration-300">lock</span>
                                <input
                                    className="w-full bg-white/70 border border-white text-walnut placeholder-walnut/30 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/10 focus:bg-white/90 transition-all duration-300 shadow-sm text-sm font-medium"
                                    id="password"
                                    placeholder="••••••••"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium text-center">
                                {error}
                            </div>
                        )}

                        <button
                            disabled={loading}
                            className="btn-liquid w-full py-4 rounded-xl text-white font-bold tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all mt-4 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                            <span>{loading ? 'Authenticating...' : 'Execute Login'}</span>
                            {!loading && <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>}
                        </button>
                    </form>

                    <div className="flex items-center justify-between pt-4 border-t border-walnut/5">
                        <a className="text-sm font-semibold text-walnut/60 hover:text-primary transition-colors" href="#">Forgot Password?</a>
                        <a className="text-sm font-semibold text-walnut/60 hover:text-primary transition-colors" href="#">Request Access</a>
                    </div>
                </div>

                <div className="mt-8 text-center opacity-0 animate-[fadeIn_1s_ease-out_0.5s_forwards]">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 border border-white/30 backdrop-blur-sm shadow-sm">
                        <span className="material-symbols-outlined text-walnut/50 text-sm">shield_lock</span>
                        <span className="text-xs font-bold text-walnut/50 tracking-wide">Secure Institutional Gateway 2.0</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
