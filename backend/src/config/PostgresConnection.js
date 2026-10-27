import pg from 'pg';
const { Pool } = pg;

class PostgresConnection {
    pool;
    isConnected;

    constructor(connectionString) {
        this.connectionString = connectionString;
        this.isConnected = false;
        this.pool = new Pool({
            connectionString: this.connectionString,
        });

        this.pool.on('error', (err) => {
            console.error('Unexpected error on idle PostgreSQL client', err);
        });
    }

    async connect() {
        try {
            const client = await this.pool.connect();
            this.isConnected = true;
            console.log('PostgreSQL connected successfully');
            client.release();
        } catch (error) {
            this.isConnected = false;
            console.error('PostgreSQL connection error:', error.message);
        }
    }

    async query(text, params) {
        return await this.pool.query(text, params);
    }

    async disconnect() {
        try {
            await this.pool.end();
            this.isConnected = false;
            console.log('PostgreSQL disconnected');
        } catch (error) {
            console.error('Error disconnecting PostgreSQL:', error.message);
        }
    }
}

export default PostgresConnection;
