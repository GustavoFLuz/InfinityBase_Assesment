import { Card } from "../types";
import { connect } from "./connect";

export class CardsDB{
    static async getCardsByBoardID(boardId: number): Promise<Card[]> {
        const { db } = await connect();
        
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM cards WHERE board_id = ?`, [boardId],
                (err: Error, rows: Card[]) => {
                    if (err) {
                        console.error(err.message);
                        resolve([]);
                    }
                    resolve(rows);
                });
        })
    }

    static async createCard(card: Card, boardId: number): Promise<number> {
        const {db} = await connect();
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO cards (title, description, card_group, creationDate, dueDate, status, priority, archived, responsible_id, board_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
            [card.title, card.description, card.group, card.creationDate, card.dueDate, card.status, card.priority, card.archived, card.responsible || null, boardId],
            function(this: {lastID: number}, err: Error) {
                if(err) {
                    console.error(err.message);
                    resolve(-1);
                }
                resolve(this.lastID);
            });
        });
    }

    static async getCardById(cardId: number): Promise<Card | undefined> {
        const { db } = await connect();
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM cards WHERE id = ?`, [cardId], (err: Error, row: Card) => {
                if (err) {
                    console.error(err.message);
                    resolve(undefined);
                }
                resolve(row);
            });
        });
    }

    static async updateCard(cardId: number, card: Card): Promise<boolean> {
        const { db } = await connect();
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE cards SET 
                    title = ?, description = ?, card_group = ?, creationDate = ?, dueDate = ?, status = ?, priority = ?, archived = ?, responsible_id = ?, completedDate = ?
                    WHERE id = ?`, 
            [card.title, card.description, card.group, card.creationDate, card.dueDate, card.status, card.priority, card.archived, card.responsible || null, card.completedDate, cardId],
            function(err: Error) {
                if(err) {
                    console.error(err.message);
                    resolve(false);
                }
                resolve(true);
            });
        });
    }

    static async deleteCard(cardId: number): Promise<boolean> {
        const { db } = await connect();
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM cards WHERE id = ?`, [cardId], function(err: Error) {
                if(err) {
                    console.error(err.message);
                    resolve(false);
                }
                resolve(true);
            });
        });
    }
}