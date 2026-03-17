import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { LogIn, ShieldCheck } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await authService.login({ email, password });
            localStorage.setItem('user', JSON.stringify(response.data));
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="bg-slate-900 p-10 rounded-2xl shadow-2xl w-full max-w-md border border-slate-800">
                <div className="flex flex-col items-center mb-10">
                    <div className="bg-blue-600 p-4 rounded-full mb-4">
                        <ShieldCheck size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Placement Cell</h1>
                    <p className="text-slate-400 mt-2">Admin Login Portal</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-slate-300 text-sm font-medium">Administrator Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white p-4 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none" placeholder="admin@college.edu" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-slate-300 text-sm font-medium">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white p-4 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none" placeholder="••••••••" required />
                    </div>

                    {error && <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">{error}</div>}

                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                        <LogIn size={20} />
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
