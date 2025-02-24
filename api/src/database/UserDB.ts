import { User } from "../types";
import { connect } from "./connect";
import bcrypt from 'bcrypt';

export class UserDB {
    static async getUserById(id: number): Promise<User | null> {
        const { db } = await connect();
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM user WHERE id = ?", [id],
                (err: Error, row: User) => {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                    }
                    if (!row) {
                        resolve(null);
                    }
                    resolve(row);
                });
        });
    }
    static async getUserByName(name: string): Promise<User | null> {
        const { db } = await connect();
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM user WHERE name = ?", [name],
                (err: Error, row: User) => {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                    }
                    if (!row) {
                        resolve(null);
                    }
                    resolve(row);
                });
        });
    }

    static async authenticateUser(name: string, password: string): Promise<User | null> {
        const { db } = await connect();
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM user WHERE name = ?", [name],
                (err: Error, row: User) => {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                    }
                    if (!row || !bcrypt.compareSync(password, row.password)) {
                        resolve(null);
                    }
                    resolve(row);
                });
        });
    }

    static async updateRefreshToken(id: number, refreshToken: string) {
        const { db } = await connect();
        db.run("UPDATE user SET refreshToken = ? WHERE id = ?", [refreshToken, id],
            (err: Error) => {
                if (err) {
                    console.error(err.message)
                }
            });
    }

    static async checkExistingUser(name: string) {
        const { db } = await connect();
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM user WHERE name = ?", [name],
                (err: Error, row: User) => {
                    if (err) {
                        reject(err.message);
                    }
                    if (row) {
                        resolve(true);
                    }
                    resolve(false);
                });
        }).catch((error) => {
            console.error("Error checking existing user:", error);
            return false;
        });
    }

    static async createUser(name: string, password: string) {
        const { db } = await connect();
        const encryptedPassword = bcrypt.hashSync(password, 10)
        return new Promise((resolve, reject) => {
            db.run("INSERT INTO user (name, password) VALUES (?, ?)", [name, encryptedPassword],
                function (err: Error) {
                    if (err) {
                        reject(err.message);
                    }
                    resolve(true);
                });
        }).catch((error) => {
            console.error("Error creating user:", error);
            return false;
        });
    }

    static async getUserByRefreshToken(refreshToken: string) {
        const { db } = await connect();
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM user WHERE refreshToken = ?", [refreshToken],
                (err: Error, row: User) => {
                    if (err) {
                        reject(err.message);
                    }
                    if (!row) {
                        resolve(null);
                    }
                    resolve(row);
                });
        }).catch((error) => {
            console.error("Error getting user by refresh token:", error);
            return null;
        });
    }
}