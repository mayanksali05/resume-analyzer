import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { UserPlus, ShieldCheck } from 'lucide-react';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await authService.register({ name, email, password });
            // After successful registration, navigate to verification page
            navigate(`/verify?email=${encodeURIComponent(email)}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-outfit">
            <div className="bg-slate-900 p-10 rounded-2xl shadow-2xl w-full max-w-md border border-slate-800">
                <div className="flex flex-col items-center mb-10">
                    <div className="bg-emerald-600 p-4 rounded-full mb-4">
                        <UserPlus size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Create Account</h1>
                    <p className="text-slate-400 mt-2">Join the Placement Admin Team</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-slate-300 text-sm font-medium">Full Name</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            className="w-full bg-slate-800 border border-slate-700 text-white p-4 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none" 
                            placeholder="John Doe" 
                            required 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-slate-300 text-sm font-medium">Administrator Email</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            className="w-full bg-slate-800 border border-slate-700 text-white p-4 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none" 
                            placeholder="admin@college.edu" 
                            required 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-slate-300 text-sm font-medium">Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="w-full bg-slate-800 border border-slate-700 text-white p-4 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none" 
                            placeholder="••••••••" 
                            required 
                        />
                    </div>

                    {error && <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">{error}</div>}

                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full bg-emerald-600 text-white p-4 rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 transform active:scale-95"
                    >
                        {loading ? 'Processing...' : 'Register Account'}
                    </button>
                    
                    <div className="text-center pt-4">
                        <p className="text-slate-500 text-sm">
                            Already have an account? <Link to="/login" className="text-emerald-500 font-bold hover:underline">Sign In</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
