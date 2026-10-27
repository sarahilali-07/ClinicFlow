import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPatients, removePatient, clearPatientState } from '../../features/patientSlice';
import { Link } from 'react-router-dom';
import { Search, Plus, Trash2, Edit2, Eye, ChevronLeft, ChevronRight, User, AlertCircle, ShieldAlert } from 'lucide-react';
import PatientModal from './PatientModal';

const PatientList = () => {
    const dispatch = useDispatch();
    const { patients, pagination, isLoading, isError, errorMessage } = useSelector((state) => state.patients);
    const { user } = useSelector((state) => state.auth);

    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [limit] = useState(6);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [patientToEdit, setPatientToEdit] = useState(null);

    // Debounced search
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            dispatch(fetchPatients({ search: searchTerm, page, limit }));
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm, page, limit, dispatch]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(1); // Reset to first page upon new search
    };

    const handleOpenAdd = () => {
        dispatch(clearPatientState());
        setPatientToEdit(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (patient) => {
        dispatch(clearPatientState());
        setPatientToEdit(patient);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        dispatch(clearPatientState());
        dispatch(fetchPatients({ search: searchTerm, page, limit }));
    };

    const handleDelete = (id, fullName) => {
        if (window.confirm(`Are you sure you want to delete patient "${fullName}"? This action soft-deletes the patient.`)) {
            dispatch(removePatient(id)).then((result) => {
                if (!result.error) {
                    dispatch(fetchPatients({ search: searchTerm, page, limit }));
                }
            });
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <User className="text-teal-600" size={26} />
                        Patients Directory
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Search, register, and manage patient profiles and consultation history.
                    </p>
                </div>

                <button
                    onClick={handleOpenAdd}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl shadow-xs transition cursor-pointer"
                >
                    <Plus size={18} />
                    <span>Register Patient</span>
                </button>
            </div>

            {/* Search Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:w-96">
                    <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search by full name or CIN..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                    />
                </div>

                <div className="text-xs text-slate-500 font-medium">
                    Showing <span className="font-bold text-slate-800">{patients.length}</span> of{' '}
                    <span className="font-bold text-slate-800">{pagination.total}</span> total patients
                </div>
            </div>

            {/* Global Error Banner */}
            {isError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-3">
                    <AlertCircle size={20} className="text-red-500 shrink-0" />
                    <span>{errorMessage}</span>
                </div>
            )}

            {/* Patients Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                {isLoading ? (
                    <div className="p-16 text-center text-sm text-slate-500">
                        Loading patient records...
                    </div>
                ) : patients.length === 0 ? (
                    <div className="p-16 text-center">
                        <User size={40} className="mx-auto text-slate-300 mb-3" />
                        <h3 className="text-base font-semibold text-slate-800">No patients found</h3>
                        <p className="text-xs text-slate-400 mt-1">
                            {searchTerm ? 'Try adjusting your search query.' : 'Click "Register Patient" to add the first record.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-100">
                                <tr>
                                    <th className="py-3.5 px-6">Patient Name</th>
                                    <th className="py-3.5 px-6">CIN</th>
                                    <th className="py-3.5 px-6">Phone</th>
                                    <th className="py-3.5 px-6">Birth Date</th>
                                    <th className="py-3.5 px-6">Registered On</th>
                                    <th className="py-3.5 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {patients.map((patient) => (
                                    <tr key={patient.id} className="hover:bg-slate-50/70 transition">
                                        <td className="py-3.5 px-6">
                                            <Link
                                                to={`/patients/${patient.id}`}
                                                className="font-bold text-slate-900 hover:text-teal-600 transition"
                                            >
                                                {patient.fullName}
                                            </Link>
                                        </td>
                                        <td className="py-3.5 px-6">
                                            <span className="font-mono text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                                                {patient.cin}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-6 text-slate-600">
                                            {patient.phone}
                                        </td>
                                        <td className="py-3.5 px-6 text-slate-600">
                                            {patient.birthDate ? patient.birthDate.split('T')[0] : 'N/A'}
                                        </td>
                                        <td className="py-3.5 px-6 text-slate-400 text-xs">
                                            {patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="py-3.5 px-6 text-right space-x-1">
                                            <Link
                                                to={`/patients/${patient.id}`}
                                                className="inline-flex p-1.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition"
                                                title="View Details"
                                            >
                                                <Eye size={17} />
                                            </Link>
                                            <button
                                                onClick={() => handleOpenEdit(patient)}
                                                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                                                title="Edit"
                                            >
                                                <Edit2 size={17} />
                                            </button>
                                            {user?.role === 'admin' && (
                                                <button
                                                    onClick={() => handleDelete(patient.id, patient.fullName)}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                                                    title="Delete (Admin Only)"
                                                >
                                                    <Trash2 size={17} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination Controls */}
                {pagination.totalPages > 1 && (
                    <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                            Page <span className="font-semibold text-slate-700">{pagination.page}</span> of{' '}
                            <span className="font-semibold text-slate-700">{pagination.totalPages}</span>
                        </span>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={pagination.page <= 1}
                                className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                                disabled={pagination.page >= pagination.totalPages}
                                className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            <PatientModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                patientToEdit={patientToEdit}
            />
        </div>
    );
};

export default PatientList;
