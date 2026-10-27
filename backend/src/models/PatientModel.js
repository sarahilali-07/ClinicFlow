import db from '../config/db.js';

class PatientModel {
    static async create({ fullName, cin, phone, birthDate, address }) {
        const query = `
            INSERT INTO patients (full_name, cin, phone, birth_date, address)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, full_name AS "fullName", cin, phone, birth_date AS "birthDate", address, created_at AS "createdAt", updated_at AS "updatedAt";
        `;
        const values = [fullName.trim(), cin.trim().toUpperCase(), phone.trim(), birthDate, address || null];
        const { rows } = await db.query(query, values);
        return rows[0];
    }

    static async findAll({ search = '', page = 1, limit = 10 }) {
        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const limitNum = Math.max(1, parseInt(limit, 10) || 10);
        const offset = (pageNum - 1) * limitNum;

        let whereClause = 'WHERE deleted_at IS NULL';
        const values = [];

        if (search && search.trim() !== '') {
            values.push(`%${search.trim()}%`);
            whereClause += ` AND (full_name ILIKE $${values.length} OR cin ILIKE $${values.length})`;
        }

        const countQuery = `SELECT COUNT(*)::int AS total FROM patients ${whereClause};`;
        const countRes = await db.query(countQuery, values);
        const total = countRes.rows[0].total;

        values.push(limitNum);
        const limitParam = `$${values.length}`;
        values.push(offset);
        const offsetParam = `$${values.length}`;

        const dataQuery = `
            SELECT id, full_name AS "fullName", cin, phone, birth_date AS "birthDate", address, created_at AS "createdAt", updated_at AS "updatedAt"
            FROM patients
            ${whereClause}
            ORDER BY created_at DESC
            LIMIT ${limitParam} OFFSET ${offsetParam};
        `;
        const { rows } = await db.query(dataQuery, values);

        return {
            patients: rows,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum) || 1
            }
        };
    }

    static async findById(id) {
        const query = `
            SELECT id, full_name AS "fullName", cin, phone, birth_date AS "birthDate", address, created_at AS "createdAt", updated_at AS "updatedAt"
            FROM patients
            WHERE id = $1 AND deleted_at IS NULL;
        `;
        const { rows } = await db.query(query, [id]);
        return rows[0] || null;
    }

    static async findByIdWithAppointments(id) {
        const patient = await this.findById(id);
        if (!patient) return null;

        const appointmentsQuery = `
            SELECT a.id, a.appointment_date AS "appointmentDate", a.status, a.reason, a.notes,
                   a.created_at AS "createdAt",
                   u.first_name || ' ' || u.last_name AS "createdByName"
            FROM appointments a
            LEFT JOIN users u ON a.created_by = u.id
            WHERE a.patient_id = $1
            ORDER BY a.appointment_date DESC;
        `;
        const { rows: appointments } = await db.query(appointmentsQuery, [id]);

        return {
            ...patient,
            appointments
        };
    }

    static async findByCin(cin) {
        const query = `
            SELECT id, full_name AS "fullName", cin, phone, birth_date AS "birthDate", address, created_at AS "createdAt"
            FROM patients
            WHERE cin = $1 AND deleted_at IS NULL;
        `;
        const { rows } = await db.query(query, [cin.trim().toUpperCase()]);
        return rows[0] || null;
    }

    static async update(id, data) {
        const fields = [];
        const values = [];
        let index = 1;

        if (data.fullName !== undefined) {
            fields.push(`full_name = $${index++}`);
            values.push(data.fullName.trim());
        }
        if (data.cin !== undefined) {
            fields.push(`cin = $${index++}`);
            values.push(data.cin.trim().toUpperCase());
        }
        if (data.phone !== undefined) {
            fields.push(`phone = $${index++}`);
            values.push(data.phone.trim());
        }
        if (data.birthDate !== undefined) {
            fields.push(`birth_date = $${index++}`);
            values.push(data.birthDate);
        }
        if (data.address !== undefined) {
            fields.push(`address = $${index++}`);
            values.push(data.address ? data.address.trim() : null);
        }

        if (fields.length === 0) return await this.findById(id);

        fields.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);

        const query = `
            UPDATE patients
            SET ${fields.join(', ')}
            WHERE id = $${index} AND deleted_at IS NULL
            RETURNING id, full_name AS "fullName", cin, phone, birth_date AS "birthDate", address, created_at AS "createdAt", updated_at AS "updatedAt";
        `;

        const { rows } = await db.query(query, values);
        return rows[0] || null;
    }

    static async softDelete(id) {
        const query = `
            UPDATE patients
            SET deleted_at = CURRENT_TIMESTAMP
            WHERE id = $1 AND deleted_at IS NULL
            RETURNING id;
        `;
        const { rows } = await db.query(query, [id]);
        return rows.length > 0;
    }

    static async count() {
        const query = `SELECT COUNT(*)::int AS total FROM patients WHERE deleted_at IS NULL;`;
        const { rows } = await db.query(query);
        return rows[0].total;
    }
}

export default PatientModel;
