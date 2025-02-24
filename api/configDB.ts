import sqlite3, { Database } from "sqlite3"
import { open } from "sqlite"
import bcrypt from "bcrypt"

async function configDB() {
    try {
        const db = await open({
            filename: "./database.db",
            driver: sqlite3.Database
        });
        await db.exec(`
            DROP table IF EXISTS 'user';
            DROP table IF EXISTS 'board';
            DROP table IF EXISTS 'board_user';
            DROP table IF EXISTS 'cards';
            `);

        await db.exec(`
            CREATE TABLE user (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                password TEXT NOT NULL,
                refreshToken TEXT
            )
        `);

        await db.exec(`
            CREATE TABLE board (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                owner_id INTEGER NOT NULL,
                FOREIGN KEY(owner_id) REFERENCES user(id)
            )
        `);

        await db.exec(`
            CREATE TABLE board_user (
                user_id INTEGER NOT NULL,
                board_id INTEGER NOT NULL,
                role TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES user(id) ON DELETE CASCADE,
                FOREIGN KEY(board_id) REFERENCES board(id) ON DELETE CASCADE
            );
            CREATE TRIGGER board_insert
                AFTER INSERT ON board
                BEGIN
                    INSERT INTO board_user (board_id, user_id, role)
                    VALUES (NEW.id, NEW.owner_id, 'owner');
                END;
        `);

        await db.exec(`
            CREATE TABLE cards (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                card_group TEXT,
                creationDate DATETIME NOT NULL,
                dueDate DATETIME NOT NULL,
                status TEXT NOT NULL,
                priority TEXT NOT NULL,
                archived INTEGER,
                completedDate DATETIME,
                responsible_id INTEGER,
                board_id INTEGER NOT NULL,
                FOREIGN KEY(board_id) REFERENCES board(id) ON DELETE CASCADE,
                FOREIGN KEY(responsible_id) REFERENCES user(id) ON DELETE SET NULL
            )
        `);
        console.log("Database is ready");
        insertData(db)
        return db;
    } catch (error) {
        console.error("Error creating database: ", error);
    }
}

async function insertData(db: any) {
    await db.exec(`
        INSERT INTO user (name, password) VALUES ('admin1', '${bcrypt.hashSync("12345", 10)}');
        INSERT INTO user (name, password) VALUES ('member2', '${bcrypt.hashSync("12345", 10)}');
        INSERT INTO user (name, password) VALUES ('member3', '${bcrypt.hashSync("12345", 10)}');
        INSERT INTO board (name, owner_id) VALUES ('board1', 1);
        INSERT INTO board (name, owner_id) VALUES ('board2', 1);
        INSERT INTO board_user (user_id, board_id, role) VALUES (2, 1, 'viewer');

        INSERT INTO cards (title, description, card_group, creationDate, dueDate, status, priority, archived, responsible_id, board_id)
            VALUES ('Card 1', 'Description 1', 'Group 1', '2021-01-01 10:00:00', '2021-01-10 10:00:00', 'Not Started', 'Low', FALSE, 1, 1);
        INSERT INTO cards (title, description, card_group, creationDate, dueDate, status, priority, archived, responsible_id, board_id)
            VALUES ('Card 2', 'Description 2', 'Group 1', '2021-01-02 10:00:00', '2021-01-11 10:00:00', 'In Progress', 'Medium', FALSE, 1, 1);
        INSERT INTO cards (title, description, card_group, creationDate, dueDate, status, priority, archived, responsible_id, board_id)
            VALUES ('Card 3', 'Description 3', 'Group 2', '2021-01-03 10:00:00', '2021-01-12 10:00:00', 'Completed', 'High', FALSE, 1, 1);
    `);
    console.log("Data inserted");
}

configDB();