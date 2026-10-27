import dotenv from 'dotenv';
import PostgresConnection from './PostgresConnection.js';

dotenv.config();

const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/clinicflow';
const db = new PostgresConnection(dbUrl);

export default db;
