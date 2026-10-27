import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AlertCircle, ArrowLeft, CalendarDays, UserRound } from 'lucide-react';
import { clearSelectedPatient, fetchPatientById } from '../../features/patientSlice';

const PatientDetails = () => {
    const { patientId } = useParams();
    const dispatch = useDispatch();
    const { selectedPatient: patient, isLoading, isError, errorMessage } = useSelector((state) => state.patients);

    useEffect(() => {
        dispatch(fetchPatientById(patientId));
        return () => dispatch(clearSelectedPatient());
    }, [dispatch, patientId]);

    if (isLoading && (!patient || patient.id !== patientId)) {
        return <p className="p-8 text-center text-sm text-slate-500">Loading patient record...</p>;
    }

    if (isError || !patient || patient.id !== patientId) {
        return (
            <div className="max-w-3xl mx-auto space-y-4">
                <Link to="/patients" className="inline-flex items-center gap-2 text-sm text-teal-700 hover:text-teal-800">
                    <ArrowLeft size={16} /> Back to patients
                </Link>
                <div role="alert" className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-3">
                    <AlertCircle size={20} />
                    {errorMessage || 'Patient record could not be found.'}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <Link to="/patients" className="inline-flex items-center gap-2 text-sm text-teal-700 hover:text-teal-800">
                <ArrowLeft size={16} /> Back to patients
            </Link>

            <section className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                    <UserRound className="text-teal-600" size={24} />
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{patient.fullName}</h1>
                        <p className="text-sm text-slate-500">Patient record</p>
                    </div>
                </div>
                <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-sm">
                    <div><dt className="text-slate-500">CIN</dt><dd className="mt-1 font-medium">{patient.cin}</dd></div>
                    <div><dt className="text-slate-500">Phone</dt><dd className="mt-1 font-medium">{patient.phone}</dd></div>
                    <div><dt className="text-slate-500">Date of birth</dt><dd className="mt-1 font-medium">{patient.birthDate?.split('T')[0] || 'N/A'}</dd></div>
                    <div className="sm:col-span-2"><dt className="text-slate-500">Address</dt><dd className="mt-1 font-medium">{patient.address || 'N/A'}</dd></div>
                </dl>
            </section>

            <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center gap-2">
                    <CalendarDays className="text-teal-600" size={20} />
                    <h2 className="font-bold text-slate-900">Appointment history</h2>
                </div>
                {!patient.appointments?.length ? (
                    <p className="p-8 text-center text-sm text-slate-500">No appointment history for this patient.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                                <tr>
                                    <th className="px-5 py-3">Date and time</th>
                                    <th className="px-5 py-3">Reason</th>
                                    <th className="px-5 py-3">Status</th>
                                    <th className="px-5 py-3">Created by</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {patient.appointments.map((appointment) => (
                                    <tr key={appointment.id}>
                                        <td className="px-5 py-3">{new Date(appointment.appointmentDate).toLocaleString()}</td>
                                        <td className="px-5 py-3">{appointment.reason}</td>
                                        <td className="px-5 py-3 capitalize">{appointment.status}</td>
                                        <td className="px-5 py-3">{appointment.createdByName || 'N/A'}</td>
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

export default PatientDetails;
