import db from '../config/db.js';

class UserModel {
    static async create({ firstName, lastName, email, password, role = 'staff' }) {
        const query = `
            INSERT INTO users (first_name, last_name, email, password, role)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, first_name, last_name, email, role, is_active, created_at, updated_at;
        `;
        const values = [firstName, lastName, email.toLowerCase().trim(), password, role];
        const { rows } = await db.query(query, values);
        return rows[0];
    }

    static async findByEmail(email) {
        const query = `
            SELECT id, first_name, last_name, email, password, role, is_active, created_at, updated_at
            FROM users
            WHERE email = $1;
        `;
        const { rows } = await db.query(query, [email.toLowerCase().trim()]);
        return rows[0] || null;
    }

    static async findById(id) {
        const query = `
            SELECT id, first_name, last_name, email, role, is_active, created_at, updated_at
            FROM users
            WHERE id = $1;
        `;
        const { rows } = await db.query(query, [id]);
        return rows[0] || null;
    }

    static async count() {
        const query = `SELECT COUNT(*)::int AS total FROM users;`;
        const { rows } = await db.query(query);
        return rows[0].total;
    }
}

export default UserModel;
