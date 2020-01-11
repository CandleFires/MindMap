import sqlite3, { Database as LiteDB } from 'sqlite3';

class Database {
    private database!: LiteDB;

    public initialize = async (): Promise<void> => {
        return new Promise((resolve, reject) => {
            ['SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException'].forEach((sig) => process.on(sig as any, process.exit));
            process.on('exit', this.dispose);

            const sqlite = process.env.NODE_ENV === 'production' ? sqlite3 : sqlite3.verbose();
            this.database = new sqlite.Database(':memory:', async (err) => {
                if (err) {
                    reject(err);
                } else {
                    try {
                        await this.setupTables();
                        resolve();
                    } catch (err2) {
                        reject(err2);
                    }
                }
            });
        });
    }

    public get instance() {
        return this.database;
    }

    private setupTables = async () => {
        return new Promise((resolve, reject) => {
            this.database.run('CREATE TABLE IF NOT EXISTS maps (id INTEGER PRIMARY KEY, owner TEXT NOT NULL, map TEXT NOT NULL)', (err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    }

    private dispose = () => {
        if (this.database) {
            this.database.close((err) => {
                if (err) {
                    console.error(err);
                }
            });
        }
    }
}

export default new Database();
