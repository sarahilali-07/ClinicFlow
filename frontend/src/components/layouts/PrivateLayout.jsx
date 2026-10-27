import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { ShieldAlert } from 'lucide-react';

const PrivateLayout = ({ allowedRoles }) => {
    const { user, token } = useSelector((state) => state.auth);

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return (
            <div className="flex h-screen bg-slate-50">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                    <Navbar user={user} />
                    <main className="flex-1 p-8 flex items-center justify-center">
                        <div className="bg-white p-8 rounded-xl shadow-xs border border-red-100 max-w-md text-center">
                            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShieldAlert size={28} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">Access Denied (403)</h2>
                            <p className="text-sm text-slate-600 mb-6">
                                You do not have the required permissions to access this feature. Admin privileges are required.
                            </p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Navbar user={user} />
                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default PrivateLayout;
