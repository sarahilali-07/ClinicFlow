import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '../../features/dashboardSlice';
import { fetchAppointments } from '../../features/appointmentSlice';
import { Link } from 'react-router-dom';
import { Users, Calendar, Clock, CheckCircle2, XCircle, ArrowUpRight, Plus, AlertCircle } from 'lucide-react';

const getLocalDate = () => {
    const date = new Date();
    const offset = date.getTimezoneOffset();
    return new Date(date.getTime() - offset * 60_000).toISOString().split('T')[0];
};

const Dashboard = () => {
    const dispatch = useDispatch();
    const { stats, isLoading: statsLoading } = useSelector((state) => state.dashboard);
    const { appointments, isLoading: apptsLoading } = useSelector((state) => state.appointments);
    const { user } = useSelector((state) => state.auth);

    const todayDateString = getLocalDate();
    const { isError: statsError, errorMessage: statsErrorMessage } = useSelector((state) => state.dashboard);
    const { isError: appointmentsError, errorMessage: appointmentsErrorMessage } = useSelector((state) => state.appointments);

    useEffect(() => {
        dispatch(fetchDashboardStats());
        dispatch(fetchAppointments({ date: todayDateString }));
    }, [dispatch, todayDateString]);

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Welcome Banner */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Welcome back, {user?.firstName || 'Doctor'} 👋
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Here is an overview of today's clinical operations and upcoming appointments.
                    </p>
                </div>

                {(statsError || appointmentsError) && (
                    <div role="alert" className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3">
                        <AlertCircle size={20} className="text-red-500 shrink-0" />
                        <div>
                            {statsError && <p>{statsErrorMessage || 'Unable to load dashboard statistics.'}</p>}
                            {appointmentsError && <p>{appointmentsErrorMessage || 'Unable to load today’s appointments.'}</p>}
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-3">
                    <Link
                        to="/patients"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold rounded-xl transition"
                    >
                        <Users size={16} />
                        <span>View Patients</span>
                    </Link>

                    <Link
                        to="/appointments"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl shadow-xs transition"
                    >
                        <Plus size={16} />
                        <span>New Appointment</span>
                    </Link>
                </div>
            </div>

            {/* Metric KPI Cards (PDF Requirement 2.4) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Total Patients */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Patients</p>
                        <h3 className="text-3xl font-extrabold text-slate-900 mt-2">
                            {statsLoading ? '...' : stats.totalPatients ?? 0}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">Registered in database</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                        <Users size={24} />
                    </div>
                </div>

                {/* Today's Appointments */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Rendez-vous du jour</p>
                        <h3 className="text-3xl font-extrabold text-blue-600 mt-2">
                            {statsLoading ? '...' : stats.todayAppointments ?? 0}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">Scheduled for today</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Calendar size={24} />
                    </div>
                </div>

                {/* Pending Appointments */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Nombre Pending</p>
                        <h3 className="text-3xl font-extrabold text-amber-500 mt-2">
                            {statsLoading ? '...' : stats.pendingAppointments ?? 0}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">Awaiting confirmation</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                        <Clock size={24} />
                    </div>
                </div>

                {/* Confirmed Appointments */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Nombre Confirmed</p>
                        <h3 className="text-3xl font-extrabold text-emerald-600 mt-2">
                            {statsLoading ? '...' : stats.confirmedAppointments ?? 0}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">Confirmed visits</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <CheckCircle2 size={24} />
                    </div>
                </div>
            </div>

            {/* Today's Appointments Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Today's Appointments Schedule</h2>
                        <p className="text-xs text-slate-500 mt-0.5">List of consultations scheduled for {todayDateString}</p>
                    </div>

                    <Link
                        to="/appointments"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700"
                    >
                        <span>All Appointments</span>
                        <ArrowUpRight size={14} />
                    </Link>
                </div>

                {apptsLoading ? (
                    <div className="p-12 text-center text-sm text-slate-500">Loading today's schedule...</div>
                ) : appointments.length === 0 ? (
                    <div className="p-12 text-center">
                        <Calendar size={36} className="mx-auto text-slate-300 mb-2" />
                        <p className="text-sm font-semibold text-slate-700">No appointments scheduled for today</p>
                        <p className="text-xs text-slate-400 mt-1">Click "New Appointment" to book a visit.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-100">
                                <tr>
                                    <th className="py-3.5 px-6">Time</th>
                                    <th className="py-3.5 px-6">Patient</th>
                                    <th className="py-3.5 px-6">CIN</th>
                                    <th className="py-3.5 px-6">Reason</th>
                                    <th className="py-3.5 px-6">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {appointments.map((appt) => (
                                    <tr key={appt.id} className="hover:bg-slate-50/60 transition">
                                        <td className="py-3.5 px-6 font-semibold text-slate-800 whitespace-nowrap">
                                            {new Date(appt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="py-3.5 px-6 font-medium text-slate-900">
                                            {appt.patientName}
                                        </td>
                                        <td className="py-3.5 px-6 text-slate-500 font-mono text-xs">
                                            {appt.patientCin}
                                        </td>
                                        <td className="py-3.5 px-6 text-slate-600 max-w-xs truncate">
                                            {appt.reason}
                                        </td>
                                        <td className="py-3.5 px-6">
                                            {appt.status === 'confirmed' ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Confirmed
                                                </span>
                                            ) : appt.status === 'pending' ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Pending
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Cancelled
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
