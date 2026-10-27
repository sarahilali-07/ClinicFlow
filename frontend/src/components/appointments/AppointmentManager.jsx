import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AlertCircle, CalendarDays, Check, Clock3, Plus, X } from 'lucide-react';
import { bookAppointment, changeAppointmentStatus, clearAppointmentState, fetchAppointments } from '../../features/appointmentSlice';
import { fetchPatients } from '../../features/patientSlice';

const statusClass = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200'
};

const AppointmentManager = () => {
    const dispatch = useDispatch();
    const { appointments, isLoading, isError, errorMessage } = useSelector((state) => state.appointments);
    const { patients, isLoading: patientsLoading } = useSelector((state) => state.patients);
    const [filters, setFilters] = useState({ date: '', status: 'all' });
    const [showForm, setShowForm] = useState(false);
    const [patientSearch, setPatientSearch] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [formData, setFormData] = useState({ appointmentDate: '', reason: '', notes: '', status: 'pending' });

    useEffect(() => {
        dispatch(fetchAppointments(filters));
    }, [dispatch, filters]);

    useEffect(() => {
        if (!showForm) return undefined;
        const timer = setTimeout(() => {
            dispatch(fetchPatients({ search: patientSearch, page: 1, limit: 10 }));
        }, 250);
        return () => clearTimeout(timer);
    }, [dispatch, patientSearch, showForm]);

    const openForm = () => {
        dispatch(clearAppointmentState());
        setSelectedPatient(null);
        setPatientSearch('');
        setFormData({ appointmentDate: '', reason: '', notes: '', status: 'pending' });
        setShowForm(true);
    };

    const submitAppointment = (event) => {
        event.preventDefault();
        if (!selectedPatient) return;
        dispatch(bookAppointment({
            ...formData,
            patientId: selectedPatient.id,
            appointmentDate: new Date(formData.appointmentDate).toISOString()
        })).then((result) => {
            if (!result.error) {
                setShowForm(false);
                dispatch(fetchAppointments(filters));
            }
        });
    };

    const updateStatus = (id, status) => {
        dispatch(changeAppointmentStatus({ id, status })).then((result) => {
            if (!result.error) dispatch(fetchAppointments(filters));
        });
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <CalendarDays className="text-teal-600" size={26} /> Appointments
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Schedule visits and manage appointment status.</p>
                </div>
                <button type="button" onClick={openForm} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl">
                    <Plus size={18} /> New appointment
                </button>
            </div>

            {isError && (
                <div role="alert" className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3">
                    <AlertCircle size={20} className="shrink-0" />
                    <span>{errorMessage || 'The appointment request failed.'}</span>
                </div>
            )}

            {showForm && (
                <form onSubmit={submitAppointment} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-bold text-slate-900">Book an appointment</h2>
                        <button type="button" onClick={() => setShowForm(false)} aria-label="Close form" className="p-1 text-slate-500 hover:text-slate-800"><X size={18} /></button>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label htmlFor="patientSearch" className="block text-xs font-semibold text-slate-700 mb-1">Find patient</label>
                            <input id="patientSearch" value={patientSearch} onChange={(event) => { setPatientSearch(event.target.value); setSelectedPatient(null); }} placeholder="Search name or CIN" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                            <select aria-label="Select patient" value={selectedPatient?.id || ''} onChange={(event) => setSelectedPatient(patients.find((patient) => patient.id === event.target.value) || null)} required className="mt-2 w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm">
                                <option value="">{patientsLoading ? 'Loading patients...' : 'Choose a patient'}</option>
                                {patients.map((patient) => <option key={patient.id} value={patient.id}>{patient.fullName} · {patient.cin}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="appointmentDate" className="block text-xs font-semibold text-slate-700 mb-1">Date and time</label>
                            <input id="appointmentDate" type="datetime-local" required value={formData.appointmentDate} onChange={(event) => setFormData({ ...formData, appointmentDate: event.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                        </div>
                        <div>
                            <label htmlFor="reason" className="block text-xs font-semibold text-slate-700 mb-1">Reason for visit</label>
                            <input id="reason" required minLength={3} value={formData.reason} onChange={(event) => setFormData({ ...formData, reason: event.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                        </div>
                        <div>
                            <label htmlFor="appointmentStatus" className="block text-xs font-semibold text-slate-700 mb-1">Initial status</label>
                            <select id="appointmentStatus" value={formData.status} onChange={(event) => setFormData({ ...formData, status: event.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm">
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="appointmentNotes" className="block text-xs font-semibold text-slate-700 mb-1">Notes (optional)</label>
                            <textarea id="appointmentNotes" rows="2" value={formData.notes} onChange={(event) => setFormData({ ...formData, notes: event.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                        </div>
                    </div>
                    <button type="submit" disabled={isLoading || !selectedPatient} className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50">
                        {isLoading ? 'Booking...' : 'Book appointment'}
                    </button>
                </form>
            )}

            <section className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-2 text-slate-500 text-sm"><Clock3 size={17} /> Filter appointments</div>
                <input aria-label="Filter by date" type="date" value={filters.date} onChange={(event) => setFilters({ ...filters, date: event.target.value })} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                <select aria-label="Filter by status" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm">
                    <option value="all">All statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                {(filters.date || filters.status !== 'all') && <button type="button" onClick={() => setFilters({ date: '', status: 'all' })} className="text-sm text-teal-700 hover:text-teal-800">Clear filters</button>}
            </section>

            <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                {isLoading && !showForm ? (
                    <p className="p-12 text-center text-sm text-slate-500">Loading appointments...</p>
                ) : appointments.length === 0 ? (
                    <p className="p-12 text-center text-sm text-slate-500">No appointments match these filters.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-5 py-3">Date and time</th>
                                    <th className="px-5 py-3">Patient</th>
                                    <th className="px-5 py-3">Reason</th>
                                    <th className="px-5 py-3">Status</th>
                                    <th className="px-5 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {appointments.map((appointment) => (
                                    <tr key={appointment.id}>
                                        <td className="px-5 py-3 whitespace-nowrap">{new Date(appointment.appointmentDate).toLocaleString()}</td>
                                        <td className="px-5 py-3"><div className="font-medium text-slate-900">{appointment.patientName}</div><div className="text-xs text-slate-500">{appointment.patientCin}</div></td>
                                        <td className="px-5 py-3">{appointment.reason}</td>
                                        <td className="px-5 py-3"><span className={`inline-flex px-2.5 py-1 border rounded-full text-xs font-semibold capitalize ${statusClass[appointment.status] || ''}`}>{appointment.status}</span></td>
                                        <td className="px-5 py-3">
                                            <div className="flex gap-2">
                                                {appointment.status !== 'confirmed' && <button type="button" onClick={() => updateStatus(appointment.id, 'confirmed')} disabled={isLoading} title="Confirm" className="p-1.5 rounded-md text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"><Check size={16} /></button>}
                                                {appointment.status !== 'cancelled' && <button type="button" onClick={() => updateStatus(appointment.id, 'cancelled')} disabled={isLoading} title="Cancel" className="p-1.5 rounded-md text-red-700 hover:bg-red-50 disabled:opacity-50"><X size={16} /></button>}
                                                {appointment.status !== 'pending' && <button type="button" onClick={() => updateStatus(appointment.id, 'pending')} disabled={isLoading} title="Return to pending" className="p-1.5 rounded-md text-amber-700 hover:bg-amber-50 disabled:opacity-50"><Clock3 size={16} /></button>}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
};

export default AppointmentManager;
