import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, LogOut, Stethoscope } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../features/authSlice';

const Sidebar = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/')
            ? 'bg-teal-600 text-white font-semibold shadow-xs'
            : 'text-slate-300 hover:bg-slate-800 hover:text-white';
    };

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/login');
    };

    return (
        <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col justify-between border-r border-slate-800 shrink-0">
            <div>
                {/* Brand Header */}
                <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800">
                    <div className="w-9 h-9 rounded-lg bg-teal-500 text-white flex items-center justify-center shadow-xs">
                        <Stethoscope size={20} />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg text-white tracking-tight">ClinicFlow</h1>
                        <p className="text-[11px] text-teal-400 font-medium">Healthcare Manager</p>
                    </div>
                </div>

                {/* Nav Links */}
                <nav className="p-4 space-y-1.5">
                    <Link
                        to="/dashboard"
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-colors ${isActive('/dashboard')}`}
                    >
                        <LayoutDashboard size={18} />
                        <span>Dashboard</span>
                    </Link>

                    <Link
                        to="/patients"
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-colors ${isActive('/patients')}`}
                    >
                        <Users size={18} />
                        <span>Patients</span>
                    </Link>

                    <Link
                        to="/appointments"
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-colors ${isActive('/appointments')}`}
                    >
                        <Calendar size={18} />
                        <span>Appointments</span>
                    </Link>
                </nav>
            </div>

            {/* Logout Footer */}
            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-3.5 py-2.5 text-sm text-slate-400 hover:text-red-400 hover:bg-slate-800/80 rounded-lg transition-colors cursor-pointer"
                >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
