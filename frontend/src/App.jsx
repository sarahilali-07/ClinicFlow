import { Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import PrivateLayout from './components/layouts/PrivateLayout';
import PatientList from './components/patients/PatientList';
import PatientDetails from './components/patients/PatientDetails';
import AppointmentManager from './components/appointments/AppointmentManager';

const HomeRedirect = () => {
    const { token, user } = useSelector((state) => state.auth);
    return <Navigate to={token && user ? '/dashboard' : '/login'} replace />;
};

const App = () => (
    <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateLayout allowedRoles={['admin', 'staff']} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/patients" element={<PatientList />} />
            <Route path="/patients/:patientId" element={<PatientDetails />} />
            <Route path="/appointments" element={<AppointmentManager />} />
        </Route>
        <Route path="*" element={<HomeRedirect />} />
    </Routes>
);

export default App;
