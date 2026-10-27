import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import db from './src/config/db.js';

dotenv.config();

async function seed() {
    try {
        console.log('Connecting to PostgreSQL database...');
        await db.connect();

        console.log('Clearing existing data...');
        await db.query('DELETE FROM appointments;');
        await db.query('DELETE FROM patients;');
        await db.query('DELETE FROM users;');

        // 1. Seed Users (1 Admin, 2 Staff)
        console.log('Seeding Users (1 Admin, 2 Staff)...');
        const adminPassword = await bcrypt.hash('Admin123456!', 10);
        const staffPassword = await bcrypt.hash('Staff123456!', 10);

        const adminQuery = `
            INSERT INTO users (first_name, last_name, email, password, role)
            VALUES ($1, $2, $3, $4, 'admin')
            RETURNING id, first_name, last_name, email, role;
        `;
        const adminRes = await db.query(adminQuery, ['Sarah', 'Hilali', 'admin@clinicflow.com', adminPassword]);
        const admin = adminRes.rows[0];

        const staffQuery = `
            INSERT INTO users (first_name, last_name, email, password, role)
            VALUES ($1, $2, $3, $4, 'staff')
            RETURNING id, first_name, last_name, email, role;
        `;
        const staff1Res = await db.query(staffQuery, ['Yassine', 'Mansouri', 'staff1@clinicflow.com', staffPassword]);
        const staff2Res = await db.query(staffQuery, ['Fatima', 'Zahra', 'staff2@clinicflow.com', staffPassword]);

        const staff1 = staff1Res.rows[0];
        const staff2 = staff2Res.rows[0];
        console.log(`Created users: 1 Admin (${admin.email}), 2 Staff (${staff1.email}, ${staff2.email})`);

        // 2. Seed Patients (5 Patients)
        console.log('Seeding Patients (5 Patients)...');
        const patientsData = [
            {
                fullName: 'Mohammed Amrani',
                cin: 'BK123456',
                phone: '+212611223344',
                birthDate: '1988-04-12',
                address: '12 Boulevard Zerktouni, Casablanca'
            },
            {
                fullName: 'Khadija El Fassi',
                cin: 'CD789012',
                phone: '+212622334455',
                birthDate: '1995-09-20',
                address: '45 Avenue Hassan II, Rabat'
            },
            {
                fullName: 'Amine Benjelloun',
                cin: 'AB345678',
                phone: '+212633445566',
                birthDate: '1982-11-03',
                address: '78 Rue de Fès, Marrakech'
            },
            {
                fullName: 'Salma Berrada',
                cin: 'EF901234',
                phone: '+212644556677',
                birthDate: '2001-02-17',
                address: '15 Boulevard Mohammed V, Tanger'
            },
            {
                fullName: 'Mehdi Chraibi',
                cin: 'GH567890',
                phone: '+212655667788',
                birthDate: '1990-07-29',
                address: '33 Avenue Allal Ben Abdellah, Fès'
            }
        ];

        const patients = [];
        for (const p of patientsData) {
            const res = await db.query(
                `INSERT INTO patients (full_name, cin, phone, birth_date, address)
                 VALUES ($1, $2, $3, $4, $5)
                 RETURNING id, full_name, cin;`,
                [p.fullName, p.cin, p.phone, p.birthDate, p.address]
            );
            patients.push(res.rows[0]);
        }
        console.log(`Created ${patients.length} patients successfully.`);

        // 3. Seed Appointments (10 Appointments, mix of pending, confirmed, cancelled)
        console.log('Seeding Appointments (10 Appointments)...');
        const appointmentsData = [
            {
                patientId: patients[0].id,
                appointmentDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // Today +2h
                status: 'confirmed',
                reason: 'Routine annual cardiology checkup',
                notes: 'Patient brings previous ECG report',
                createdBy: staff1.id
            },
            {
                patientId: patients[0].id,
                appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
                status: 'pending',
                reason: 'Follow-up blood test review',
                notes: 'Fasting required prior to visit',
                createdBy: staff2.id
            },
            {
                patientId: patients[1].id,
                appointmentDate: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // Today +3h
                status: 'confirmed',
                reason: 'Dermatology consultation for skin rash',
                notes: 'Allergy history noted in file',
                createdBy: staff1.id
            },
            {
                patientId: patients[1].id,
                appointmentDate: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // Past
                status: 'cancelled',
                reason: 'Initial consultation',
                notes: 'Cancelled by patient due to emergency travel',
                createdBy: admin.id
            },
            {
                patientId: patients[2].id,
                appointmentDate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // Today +4h
                status: 'confirmed',
                reason: 'General medicine consultation - persistent migraine',
                notes: 'Prescribe initial pain relief and MRI referral',
                createdBy: staff2.id
            },
            {
                patientId: patients[2].id,
                appointmentDate: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(), // In 3 days
                status: 'pending',
                reason: 'Orthopedic consultation for knee pain',
                notes: 'Pre-consultation X-rays requested',
                createdBy: staff1.id
            },
            {
                patientId: patients[3].id,
                appointmentDate: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(), // Today +5h
                status: 'pending',
                reason: 'Pediatric checkup for immunization booster',
                notes: 'Vaccination record checked',
                createdBy: admin.id
            },
            {
                patientId: patients[3].id,
                appointmentDate: new Date(Date.now() + 96 * 60 * 60 * 1000).toISOString(), // In 4 days
                status: 'confirmed',
                reason: 'Ophthalmology vision screening',
                notes: 'Requested renewed prescription for spectacles',
                createdBy: staff1.id
            },
            {
                patientId: patients[4].id,
                appointmentDate: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // Today +6h
                status: 'pending',
                reason: 'ENT consultation for acute sinus congestion',
                notes: 'Symptom duration 5 days',
                createdBy: staff2.id
            },
            {
                patientId: patients[4].id,
                appointmentDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
                status: 'cancelled',
                reason: 'Dental hygiene and cleaning',
                notes: 'Rescheduled upon clinic request due to doctor absence',
                createdBy: admin.id
            }
        ];

        let createdCount = 0;
        for (const a of appointmentsData) {
            await db.query(
                `INSERT INTO appointments (patient_id, appointment_date, status, reason, notes, created_by)
                 VALUES ($1, $2, $3, $4, $5, $6);`,
                [a.patientId, a.appointmentDate, a.status, a.reason, a.notes, a.createdBy]
            );
            createdCount++;
        }

        console.log('\n================ SEED SUMMARY ================');
        console.log(`Users:        3 (1 Admin: admin@clinicflow.com, 2 Staff)`);
        console.log(`Patients:     ${patients.length}`);
        console.log(`Appointments: ${createdCount} (4 Confirmed, 4 Pending, 2 Cancelled)`);
        console.log('Default Passwords:');
        console.log('  Admin: Admin123456!');
        console.log('  Staff: Staff123456!');
        console.log('==============================================');
        console.log('Seeding completed successfully!');
    } catch (error) {
        console.error('Error during seeding:', error);
        process.exitCode = 1;
    } finally {
        await db.disconnect();
    }
}

seed();
