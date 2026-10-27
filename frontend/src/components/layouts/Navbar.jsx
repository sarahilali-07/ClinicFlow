import { User, Shield, Stethoscope } from 'lucide-react';

const Navbar = ({ user }) => {
    const todayFormatted = new Date().toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-500">
                    {todayFormatted}
                </span>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                    <div className="w-9 h-9 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center font-semibold text-sm border border-teal-200">
                        {user?.firstName?.[0] || 'U'}{user?.lastName?.[0] || ''}
                    </div>
                    <div className="text-left hidden sm:block">
                        <p className="text-sm font-semibold text-slate-800 leading-tight">
                            {user?.firstName} {user?.lastName}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                            {user?.role === 'admin' ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                                    <Shield size={10} /> Admin
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                                    <Stethoscope size={10} /> Staff
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
