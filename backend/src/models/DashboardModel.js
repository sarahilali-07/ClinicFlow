import db from '../config/db.js';

class DashboardModel {
    static async getStats() {
        const query = `
            SELECT
                (SELECT COUNT(*)::int FROM patients WHERE deleted_at IS NULL) AS "totalPatients",
                (SELECT COUNT(*)::int FROM appointments WHERE DATE(appointment_date) = CURRENT_DATE) AS "todayAppointments",
                (SELECT COUNT(*)::int FROM appointments WHERE status = 'pending') AS "pendingAppointments",
                (SELECT COUNT(*)::int FROM appointments WHERE status = 'confirmed') AS "confirmedAppointments",
                (SELECT COUNT(*)::int FROM appointments WHERE status = 'cancelled') AS "cancelledAppointments";
        `;
        const { rows } = await db.query(query);
        return rows[0];
    }
}

export default DashboardModel;
