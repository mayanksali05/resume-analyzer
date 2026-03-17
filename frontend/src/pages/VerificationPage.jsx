import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/api';
import { Mail, CheckCircle, RefreshCw } from 'lucide-react';

const VerificationPage = () => {
    const [code, setCode] = useState('');
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    
    // Get email from query params
    const query = new URLSearchParams(location.search);
    const email = query.get('email');

    useEffect(() => {
        if (!email) {
            navigate('/login');
        }
    }, [email, navigate]);

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await authService.verifyEmail({ email, code });
            setMessage('Email verified! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed. Please check the code.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        setError(null);
        try {
            await authService.resendCode(email);
            setMessage('A new verification code has been sent!');
        } catch (err) {
            setError('Failed to resend code.');
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="bg-slate-900 p-10 rounded-2xl shadow-2xl w-full max-w-md border border-slate-800">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-blue-600 p-4 rounded-full mb-4">
                        <Mail size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Verify Email</h1>
                    <p className="text-slate-400 mt-2 text-center">We've sent a 6-digit code to <br /><span className="text-blue-400 font-medium">{email}</span></p>
                </div>

                <form onSubmit={handleVerify} className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-slate-300 text-sm font-medium">Verification Code</label>
                        </div>
                        <input 
                            type="text" 
                            value={code} 
                            onChange={(e) => setCode(e.target.value)} 
                            className="w-full bg-slate-800 border border-slate-700 text-white p-4 rounded-xl text-center text-2xl font-black tracking-[0.5em] focus:ring-2 focus:ring-blue-500 transition-all outline-none" 
                            placeholder="000000" 
                            maxLength={6}
                            required 
                        />
                    </div>

                    {error && <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">{error}</div>}
                    {message && <div className="text-emerald-400 text-sm bg-emerald-400/10 p-3 rounded-lg border border-emerald-400/20">{message}</div>}

                    <button 
                        type="submit" 
                        disabled={loading || code.length !== 6} 
                        className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 transform active:scale-95 disabled:bg-slate-700 disabled:opacity-50"
                    >
                        {loading ? 'Verifying...' : 'Verify Now'}
                    </button>
                    
                    <div className="text-center pt-2">
                        <button 
                            type="button"
                            onClick={handleResend}
                            disabled={resending}
                            className="text-slate-500 text-sm hover:text-white flex items-center justify-center gap-2 mx-auto"
                        >
                            {resending ? <RefreshCw size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                            Resend Code
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VerificationPage;
