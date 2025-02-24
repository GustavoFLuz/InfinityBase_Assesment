import path from 'path';
import { Database, open } from 'sqlite';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';

let dbInstance: Database | null = null

export async function connect(): Promise<Database> {
    if (dbInstance) return dbInstance
    dbInstance = await open({
        filename: path.join(__dirname, '../../database.db'),
        driver: sqlite3.Database
    })
    return dbInstance;
}