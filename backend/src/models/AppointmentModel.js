import db from '../config/db.js';

class AppointmentModel {
    static async create({ patientId, appointmentDate, status = 'pending', reason, notes, createdBy }) {
        const query = `
            INSERT INTO appointments (patient_id, appointment_date, status, reason, notes, created_by)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, patient_id AS "patientId", appointment_date AS "appointmentDate", status, reason, notes,
                      created_by AS "createdBy", created_at AS "createdAt", updated_at AS "updatedAt";
        `;
        const values = [patientId, appointmentDate, status, reason.trim(), notes ? notes.trim() : null, createdBy];
        const { rows } = await db.query(query, values);
        return rows[0];
    }

    static async findAll({ date, status } = {}) {
        let whereConditions = [];
        let values = [];

        if (date) {
            values.push(date);
            whereConditions.push(`DATE(a.appointment_date) = $${values.length}`);
        }

        if (status) {
            values.push(status);
            whereConditions.push(`a.status = $${values.length}`);
        }

        const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

        const query = `
            SELECT 
                a.id,
                a.appointment_date AS "appointmentDate",
                a.status,
                a.reason,
                a.notes,
                a.created_at AS "createdAt",
                a.updated_at AS "updatedAt",
                p.id AS "patientId",
                p.full_name AS "patientName",
                p.cin AS "patientCin",
                p.phone AS "patientPhone",
                u.id AS "createdById",
                u.first_name || ' ' || u.last_name AS "createdByName"
            FROM appointments a
            JOIN patients p ON a.patient_id = p.id
            JOIN users u ON a.created_by = u.id
            ${whereClause}
            ORDER BY a.appointment_date ASC;
        `;

        const { rows } = await db.query(query, values);
        return rows;
    }

    static async findById(id) {
        const query = `
            SELECT 
                a.id,
                a.appointment_date AS "appointmentDate",
                a.status,
                a.reason,
                a.notes,
                a.created_at AS "createdAt",
                a.updated_at AS "updatedAt",
                p.id AS "patientId",
                p.full_name AS "patientName",
                p.cin AS "patientCin",
                p.phone AS "patientPhone",
                u.id AS "createdById",
                u.first_name || ' ' || u.last_name AS "createdByName"
            FROM appointments a
            JOIN patients p ON a.patient_id = p.id
            JOIN users u ON a.created_by = u.id
            WHERE a.id = $1;
        `;
        const { rows } = await db.query(query, [id]);
        return rows[0] || null;
    }

    static async updateStatus(id, status) {
        const query = `
            UPDATE appointments
            SET status = $1, updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING id, patient_id AS "patientId", appointment_date AS "appointmentDate", status, reason, notes, updated_at AS "updatedAt";
        `;
        const { rows } = await db.query(query, [status, id]);
        return rows[0] || null;
    }

    /**
     * Critical Rule: Check if a confirmed appointment already exists for this patient within a 30-minute window
     */
    static async findConflictingAppointment(patientId, appointmentDate, excludeAppointmentId = null) {
        let query = `
            SELECT id, appointment_date AS "appointmentDate", status
            FROM appointments
            WHERE patient_id = $1
              AND status = 'confirmed'
              AND appointment_date >= ($2::timestamptz - INTERVAL '30 minutes')
              AND appointment_date <= ($2::timestamptz + INTERVAL '30 minutes')
        `;
        const values = [patientId, appointmentDate];

        if (excludeAppointmentId) {
            values.push(excludeAppointmentId);
            query += ` AND id != $3`;
        }

        query += ` LIMIT 1;`;

        const { rows } = await db.query(query, values);
        return rows[0] || null;
    }

    static async countToday() {
        const query = `
            SELECT COUNT(*)::int AS total
            FROM appointments
            WHERE DATE(appointment_date) = CURRENT_DATE;
        `;
        const { rows } = await db.query(query);
        return rows[0].total;
    }

    static async countByStatus(status) {
        const query = `
            SELECT COUNT(*)::int AS total
            FROM appointments
            WHERE status = $1;
        `;
        const { rows } = await db.query(query, [status]);
        return rows[0].total;
    }
}

export default AppointmentModel;
