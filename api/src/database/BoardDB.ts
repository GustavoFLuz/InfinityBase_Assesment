import { Board, BoardUser, User } from "../types";
import { connect } from "./connect"

export class BoardDB {
    static async getBoardsByUserID(id: number): Promise<Board[]> {
        const { db } = await connect();
        return new Promise((resolve, reject) => {
            db.all(`SELECT board.*, board_user.role
                FROM board
                INNER JOIN board_user ON board.id = board_user.board_id
                WHERE board_user.user_id = ?`, [id],
                (err: Error, rows: Board[]) => {
                    if (err) {
                        console.error(err.message);
                        resolve([]);
                    }
                    resolve(rows);
                });
        })
    }

    static async createBoard(ownerId: number, name: string): Promise<number> {
        const { db } = await connect();
        return new Promise((resolve, reject) => {
            db.run("INSERT INTO board (name, owner_id) VALUES (?, ?)", [name, ownerId],
                function (this: { lastID: number }, err: Error) {
                    if (err) {
                        console.error(err.message);
                        resolve(-1);
                    }
                    resolve(this.lastID);
                });
        })
    }

    static async addUserToBoard(userId: number, boardId: number, role: string) {
        const { db } = await connect();
        return new Promise((resolve, reject) => {
            db.run("INSERT INTO board_user (user_id, board_id, role) VALUES (?, ?, ?)", [userId, boardId, role],
                function (err: Error) {
                    if (err) {
                        console.error(err.message);
                        resolve(false);
                    }
                    resolve(true);
                });
        })
    }

    static async getBoardMembers(boardId: number): Promise<{name: string, id:number, role:string}[]> {
        if (!boardId) {
            return [];
        }
        
        const { db } = await connect();
        return new Promise((resolve, reject) => {
            db.all(`SELECT user.name, user.id, board_user.role
                FROM user
                INNER JOIN board_user ON user.id = board_user.user_id
                WHERE board_user.board_id = ?`, [boardId],
                (err: Error, rows: {name: string, id:number, role:string}[]) => {
                    if (err) {
                        console.error(err.message);
                        resolve([]);
                    }
                    resolve(rows);
                });
        })
    }
}