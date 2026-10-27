import app from './src/app.js';

let server;
const PORT = 5055;
const BASE_URL = `http://localhost:${PORT}`;

async function runTests() {
    console.log('--- Starting ClinicFlow API Integration Tests ---\n');

    server = app.listen(PORT);
    await new Promise((resolve) => setTimeout(resolve, 500));

    let passed = 0;
    let failed = 0;

    const assert = (condition, testName) => {
        if (condition) {
            console.log(`PASS: ${testName}`);
            passed++;
        } else {
            console.error(`FAIL: ${testName}`);
            failed++;
        }
    };

    try {
        // 1. Health check
        const resHealth = await fetch(`${BASE_URL}/`);
        const jsonHealth = await resHealth.json();
        assert(resHealth.status === 200 && jsonHealth.status === 'OK', '1. GET / - Health Check');

        // 2. Auth - Invalid Login
        const resBadLogin = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@clinicflow.com', password: 'WrongPassword!' })
        });
        assert(resBadLogin.status === 401, '2. POST /api/auth/login - Rejects invalid password (401)');

        // 3. Auth - Valid Admin Login
        const resAdminLogin = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@clinicflow.com', password: 'Admin123456!' })
        });
        const jsonAdmin = await resAdminLogin.json();
        const adminToken = jsonAdmin.token;
        assert(resAdminLogin.status === 200 && !!adminToken, '3. POST /api/auth/login - Admin Login returns JWT');

        // 4. Auth - Valid Staff Login
        const resStaffLogin = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'staff1@clinicflow.com', password: 'Staff123456!' })
        });
        const jsonStaff = await resStaffLogin.json();
        const staffToken = jsonStaff.token;
        assert(resStaffLogin.status === 200 && !!staffToken, '4. POST /api/auth/login - Staff Login returns JWT');

        // 5. Auth - GET /api/auth/me
        const resMe = await fetch(`${BASE_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const jsonMe = await resMe.json();
        assert(resMe.status === 200 && jsonMe.user.email === 'admin@clinicflow.com', '5. GET /api/auth/me - Decodes current user');

        // 6. Patients - Pagination & List
        const resPatients = await fetch(`${BASE_URL}/api/patients?page=1&limit=3`, {
            headers: { Authorization: `Bearer ${staffToken}` }
        });
        const jsonPatients = await resPatients.json();
        assert(
            resPatients.status === 200 &&
            jsonPatients.patients.length === 3 &&
            jsonPatients.pagination.total >= 5,
            '6. GET /api/patients - Pagination & listing'
        );

        // 7. Patients - Search by name
        const resSearchName = await fetch(`${BASE_URL}/api/patients?search=Amrani`, {
            headers: { Authorization: `Bearer ${staffToken}` }
        });
        const jsonSearchName = await resSearchName.json();
        assert(
            resSearchName.status === 200 &&
            jsonSearchName.patients.length === 1 &&
            jsonSearchName.patients[0].fullName.includes('Amrani'),
            '7. GET /api/patients?search=Amrani - Search by fullName'
        );

        // 8. Patients - Search by CIN
        const resSearchCin = await fetch(`${BASE_URL}/api/patients?search=BK123456`, {
            headers: { Authorization: `Bearer ${staffToken}` }
        });
        const jsonSearchCin = await resSearchCin.json();
        assert(
            resSearchCin.status === 200 &&
            jsonSearchCin.patients.length === 1 &&
            jsonSearchCin.patients[0].cin === 'BK123456',
            '8. GET /api/patients?search=BK123456 - Search by CIN'
        );

        // 9. Patients - Create Patient
        const newPatientData = {
            fullName: 'Driss Tazi',
            cin: 'WA998877',
            phone: '+212677889900',
            birthDate: '1992-06-15',
            address: 'Agdal, Rabat'
        };
        const resCreatePatient = await fetch(`${BASE_URL}/api/patients`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${staffToken}`
            },
            body: JSON.stringify(newPatientData)
        });
        const jsonCreatePatient = await resCreatePatient.json();
        const createdPatientId = jsonCreatePatient.id;
        assert(resCreatePatient.status === 201 && !!createdPatientId, '9. POST /api/patients - Create new patient');

        // 10. Patients - Duplicate CIN Conflict
        const resDupCin = await fetch(`${BASE_URL}/api/patients`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${staffToken}`
            },
            body: JSON.stringify(newPatientData)
        });
        assert(resDupCin.status === 409, '10. POST /api/patients - Rejects duplicate CIN (409)');

        // 11. Patients - Get by ID with appointments
        const resPatientById = await fetch(`${BASE_URL}/api/patients/${jsonPatients.patients[0].id}`, {
            headers: { Authorization: `Bearer ${staffToken}` }
        });
        const jsonPatientById = await resPatientById.json();
        assert(
            resPatientById.status === 200 &&
            Array.isArray(jsonPatientById.appointments),
            '11. GET /api/patients/:id - Returns patient details + their appointments'
        );

        // 12. Patients - Update
        const resUpdatePatient = await fetch(`${BASE_URL}/api/patients/${createdPatientId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${staffToken}`
            },
            body: JSON.stringify({ phone: '+212600112233' })
        });
        const jsonUpdatePatient = await resUpdatePatient.json();
        assert(resUpdatePatient.status === 200 && jsonUpdatePatient.phone === '+212600112233', '12. PUT /api/patients/:id - Update patient phone');

        // 13. Patients - Delete (RBAC: Staff should be forbidden)
        const resStaffDelete = await fetch(`${BASE_URL}/api/patients/${createdPatientId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${staffToken}` }
        });
        assert(resStaffDelete.status === 403, '13. DELETE /api/patients/:id - Staff forbidden (403)');

        // 14. Patients - Delete (RBAC: Admin permitted)
        const resAdminDelete = await fetch(`${BASE_URL}/api/patients/${createdPatientId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        assert(resAdminDelete.status === 200, '14. DELETE /api/patients/:id - Admin successfully deletes (soft-delete)');

        // 15. Appointments - List all & filter
        const resAppts = await fetch(`${BASE_URL}/api/appointments?status=confirmed`, {
            headers: { Authorization: `Bearer ${staffToken}` }
        });
        const jsonAppts = await resAppts.json();
        assert(
            resAppts.status === 200 &&
            Array.isArray(jsonAppts) &&
            jsonAppts.every(a => a.status === 'confirmed'),
            '15. GET /api/appointments?status=confirmed - Filter by status'
        );

        // 16. Appointments - 30-Minute Invariant Rule
        // Setup: Create confirmed appointment at T
        const targetPatientId = jsonPatients.patients[0].id;
        const testDateT = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000); // 10 days in future at 10:00:00
        testDateT.setHours(10, 0, 0, 0);

        const resFirstConfirmed = await fetch(`${BASE_URL}/api/appointments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${staffToken}`
            },
            body: JSON.stringify({
                patientId: targetPatientId,
                appointmentDate: testDateT.toISOString(),
                status: 'confirmed',
                reason: 'Baseline appointment at T'
            })
        });
        const jsonFirst = await resFirstConfirmed.json();
        assert(resFirstConfirmed.status === 201, '16. POST /api/appointments - Create confirmed appointment at T');

        // Test conflict: Attempt confirmed appointment at T + 15 minutes (within 30m window)
        const testDateConflict = new Date(testDateT.getTime() + 15 * 60 * 1000);
        const resConflict = await fetch(`${BASE_URL}/api/appointments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${staffToken}`
            },
            body: JSON.stringify({
                patientId: targetPatientId,
                appointmentDate: testDateConflict.toISOString(),
                status: 'confirmed',
                reason: 'Conflicting appointment within 15 mins'
            })
        });
        assert(
            resConflict.status === 409,
            '17. BUSINESS RULE: 30-min window violation properly blocked (409 Conflict)'
        );

        // Test non-conflict: Attempt confirmed appointment at T + 45 minutes (outside 30m window)
        const testDateOutside = new Date(testDateT.getTime() + 45 * 60 * 1000);
        const resOutside = await fetch(`${BASE_URL}/api/appointments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${staffToken}`
            },
            body: JSON.stringify({
                patientId: targetPatientId,
                appointmentDate: testDateOutside.toISOString(),
                status: 'confirmed',
                reason: 'Valid appointment at T + 45 mins'
            })
        });
        assert(
            resOutside.status === 201,
            '18. BUSINESS RULE: Appointment outside 30-min window succeeds (201 Created)'
        );

        // 19. Appointments - PATCH status
        const resPatch = await fetch(`${BASE_URL}/api/appointments/${jsonFirst.id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${staffToken}`
            },
            body: JSON.stringify({ status: 'cancelled' })
        });
        const jsonPatch = await resPatch.json();
        assert(resPatch.status === 200 && jsonPatch.status === 'cancelled', '19. PATCH /api/appointments/:id/status - Update status to cancelled');

        // 20. Dashboard Stats
        const resDashboard = await fetch(`${BASE_URL}/api/dashboard/stats`, {
            headers: { Authorization: `Bearer ${staffToken}` }
        });
        const jsonDashboard = await resDashboard.json();
        assert(
            resDashboard.status === 200 &&
            typeof jsonDashboard.totalPatients === 'number' &&
            typeof jsonDashboard.todayAppointments === 'number' &&
            typeof jsonDashboard.pendingAppointments === 'number' &&
            typeof jsonDashboard.confirmedAppointments === 'number',
            '20. GET /api/dashboard/stats - Returns valid KPI counters'
        );

    } catch (err) {
        console.error('Test execution error:', err);
        failed++;
    } finally {
        server.close();
        console.log(`\n--- Test Summary: ${passed} Passed, ${failed} Failed ---`);
        process.exit(failed > 0 ? 1 : 0);
    }
}

runTests();
