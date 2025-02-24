import { Request, Response } from 'express';
import { BoardDB } from '../database/BoardDB'; // Adjust the path as necessary
import { UserDB } from '../database/UserDB';

export class BoardController {
    static async getAllBoards(req: Request, res: Response) {
        const userId = res.locals.userId;
        
        const boards = await BoardDB.getBoardsByUserID(userId);

        if (!boards.length) {
            res.status(404).json({ 'message': 'Nenhum quadro encontrado' });
            return
        }
        res.json(boards);
    }

    static async createBoard(req: Request, res: Response) {
        const userId = res.locals.userId;
        const { name } = req.body;

        if (!name) {
            res.status(400).json({ 'message': 'Nome do quadro é necessário' });
            return
        }
        const id = await BoardDB.createBoard(userId, name);
        if (!id) {
            res.status(500).json({ 'message': 'Erro ao criar quadro' });
            return
        }
        res.json({ 'message': 'Quadro criado com sucesso', data: { id, name, owner_id: userId, role: "owner" } });
    }

    static async getBoardMembers(req: Request, res: Response) {
        const boardId = req.params.id;
        const members = await BoardDB.getBoardMembers(parseInt(boardId));

        if (!members.length) {
            res.status(404).json({ 'message': 'Nenhum membro encontrado' });
            return
        }
        res.json(members);
    }

    static async addMemberToBoard(req: Request, res: Response) {
        const userId = res.locals.userId;
        const boardId = parseInt(req.params.id);
        const newUserName = req.body.name;
        const role = req.body.role;

        const users = await BoardDB.getBoardMembers(boardId);
        if (!users.find(u => u.id === userId && u.role === 'owner')) {
            res.status(403).json({ 'message': 'Usuário não tem permissão para adicionar usuário ao quadro' });
            return
        }

        if (!newUserName || !role) {
            res.status(400).json({ 'message': 'ID do usuário e Cargo são necessários' });
            return
        }

        const newUser = await UserDB.getUserByName(newUserName);
        if (!newUser) {
            res.status(404).json({ 'message': 'Usuário não encontrado' });
            return
        }

        const success = await BoardDB.addUserToBoard(newUser.id, boardId, role);
        if (!success) {
            res.status(500).json({ 'message': 'Erro ao adicionar usuário' });
            return
        }
        res.json({ 'message': 'Usuário adicionado com sucesso' });
    }
}