import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createNewPatient, updateExistingPatient, clearPatientState } from '../../features/patientSlice';
import { X, User, CreditCard, Phone, Calendar, MapPin, AlertCircle } from 'lucide-react';

const PatientModal = ({ isOpen, onClose, patientToEdit }) => {
    const dispatch = useDispatch();
    const { isLoading, isError, errorMessage, actionSuccess } = useSelector((state) => state.patients);

    const [formData, setFormData] = useState({
        fullName: '',
        cin: '',
        phone: '',
        birthDate: '',
        address: ''
    });

    useEffect(() => {
        if (patientToEdit) {
            setFormData({
                fullName: patientToEdit.fullName || '',
                cin: patientToEdit.cin || '',
                phone: patientToEdit.phone || '',
                birthDate: patientToEdit.birthDate ? patientToEdit.birthDate.split('T')[0] : '',
                address: patientToEdit.address || ''
            });
        } else {
            setFormData({
                fullName: '',
                cin: '',
                phone: '',
                birthDate: '',
                address: ''
            });
        }
    }, [patientToEdit, isOpen]);

    useEffect(() => {
        if (actionSuccess && isOpen) {
            onClose();
            dispatch(clearPatientState());
        }
    }, [actionSuccess, isOpen, onClose, dispatch]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (patientToEdit) {
            dispatch(updateExistingPatient({ id: patientToEdit.id, data: formData }));
        } else {
            dispatch(createNewPatient(formData));
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900">
                        {patientToEdit ? 'Edit Patient Information' : 'Register New Patient'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {isError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start gap-2">
                            <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                name="fullName"
                                required
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="e.g. Mohammed Amrani"
                                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                CIN (National ID) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    name="cin"
                                    required
                                    value={formData.cin}
                                    onChange={handleChange}
                                    placeholder="e.g. BK123456"
                                    className="w-full pl-9 pr-3 py-2 uppercase bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+212611223344"
                                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Birth Date <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="date"
                                name="birthDate"
                                required
                                value={formData.birthDate}
                                onChange={handleChange}
                                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Residential Address <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <div className="relative">
                            <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
                            <textarea
                                name="address"
                                rows="2"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Street address, city"
                                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                            ></textarea>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 font-medium rounded-xl hover:bg-slate-100 transition cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50"
                        >
                            {isLoading ? 'Saving...' : patientToEdit ? 'Update Patient' : 'Register Patient'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PatientModal;
