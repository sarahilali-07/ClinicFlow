import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, clearAuthError } from '../../features/authSlice';
import { Stethoscope, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

const Login = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isLoading, isError, errorMessage } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user) {
            navigate('/dashboard', { replace: true });
        }
        return () => {
            dispatch(clearAuthError());
        };
    }, [user, navigate, dispatch]);

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
        if (isError) dispatch(clearAuthError());
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(credentials));
    };

    const fillCredentials = (email, password) => {
        setCredentials({ email, password });
        if (isError) dispatch(clearAuthError());
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-teal-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-slate-100">
                {/* Brand Header */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-teal-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-teal-500/30">
                        <Stethoscope size={30} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">ClinicFlow</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Sign in to access patient records and appointments
                    </p>
                </div>

                {/* Error Banner */}
                {isError && (
                    <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 text-sm">
                        <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-500" />
                        <span>{errorMessage}</span>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="email"
                                name="email"
                                required
                                value={credentials.email}
                                onChange={handleChange}
                                placeholder="name@clinicflow.com"
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                            Password
                        </label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="password"
                                name="password"
                                required
                                value={credentials.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
                    >
                        {isLoading ? (
                            <span>Signing in...</span>
                        ) : (
                            <>
                                <span>Sign In</span>
                                <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </form>

                {/* Quick Test Demo Credentials */}
                <div className="mt-8 pt-6 border-t border-slate-100">
                    <p className="text-xs text-slate-400 text-center font-medium mb-3 uppercase tracking-wider">
                        Quick Demo Credentials (from Seed)
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => fillCredentials('admin@clinicflow.com', 'Admin123456!')}
                            className="p-2 bg-slate-50 hover:bg-purple-50 hover:border-purple-200 border border-slate-200 rounded-lg text-left transition cursor-pointer"
                        >
                            <p className="text-xs font-bold text-slate-800">Admin Account</p>
                            <p className="text-[11px] text-slate-500">admin@clinicflow.com</p>
                        </button>

                        <button
                            type="button"
                            onClick={() => fillCredentials('staff1@clinicflow.com', 'Staff123456!')}
                            className="p-2 bg-slate-50 hover:bg-teal-50 hover:border-teal-200 border border-slate-200 rounded-lg text-left transition cursor-pointer"
                        >
                            <p className="text-xs font-bold text-slate-800">Staff Account</p>
                            <p className="text-[11px] text-slate-500">staff1@clinicflow.com</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
