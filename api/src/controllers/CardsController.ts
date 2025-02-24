import { BoardDB } from "../database/BoardDB";
import { CardsDB } from "../database/CardsDB";

const convertToSQLDate = (date: string) => {
    return new Date(date).toISOString().slice(0, 19).replace("T", " ")
}

export class CardsController {
    static async getAllCards(req: any, res: any) {
        const boardId = req.params.id;
        const userId = res.locals.userId;

        const members = await BoardDB.getBoardMembers(parseInt(boardId));
        if (!members.find(m => m.id === userId)) {
            res.status(403).json({ 'message': 'Usuário não pertence ao quadro' });
            return
        }

        const cards = await CardsDB.getCardsByBoardID(parseInt(boardId));

        res.json(cards);
    }

    static async createCard(req: any, res: any) {
        const boardId = req.params.id;
        const userId = res.locals.userId;
        const info = req.body;

        const members = await BoardDB.getBoardMembers(parseInt(boardId));
        if (!members.find(m => m.id === userId)) {
            res.status(403).json({ 'message': 'Usuário não pertence ao quadro' });
            return
        }

        if (!info.title || !info.dueDate || !info.priority) {
            res.status(400).json({ 'message': 'Informações incompletas para criar um card' });
            return
        }
        const id = await CardsDB.createCard({
            title: info.title,
            description: info.description,
            dueDate: convertToSQLDate(info.dueDate),
            priority: info.priority,
            group: info.group,
            creationDate: convertToSQLDate(info.creationDate || null),
            responsible: info.responsible || "",
            status: info.status || 'Not Started',
            archived: false,
            completedDate: info.completedDate || undefined
        }, parseInt(boardId));

        if (id === -1) {
            res.status(500).json({ 'message': 'Erro ao criar tarefa' });
            return
        }

        res.json({ 'message': 'Tarefa cadastrada com sucesso', id });
    }

    static async updateCard(req: any, res: any) {
        const cardId = req.params.id;
        const userId = res.locals.userId;
        const info = req.body;

        const card = await CardsDB.getCardById(parseInt(cardId));
        if (!card) {
            res.status(404).json({ 'message': 'Tarefa não encontrada' });
            return
        }

        const boardId = card.board_id;
        if (!boardId) {
            res.status(404).json({ 'message': 'Quadro não encontrado' });
            return
        }

        const members = await BoardDB.getBoardMembers(boardId);
        if (!members.find(m => m.id === userId && m.role === 'owner')) {
            res.status(403).json({ 'message': 'Usuário não pertence ao quadro' });
            return
        }

        CardsDB.updateCard(parseInt(cardId), {
            title: info.title || card.title,
            description: info.description || card.description,
            dueDate: convertToSQLDate(info.dueDate || card.dueDate),
            priority: info.priority || card.priority,
            group: info.group || card.group,
            creationDate: convertToSQLDate(info.creationDate || card.creationDate),
            responsible: info.responsible || card.responsible,
            status: info.status || card.status,
            archived: info.archived || card.archived,
            completedDate: info.completedDate || card.completedDate
        });

        res.json({ 'message': 'Tarefa atualizada com sucesso' });
    }

    static async deleteCard(req: any, res: any) {
        const cardId = req.params.id;
        const userId = res.locals.userId;

        const card = await CardsDB.getCardById(parseInt(cardId));
        if (!card) {
            res.status(404).json({ 'message': 'Tarefa não encontrada' });
            return
        }

        const boardId = card.board_id;
        if (!boardId) {
            res.status(404).json({ 'message': 'Quadro não encontrado' });
            return
        }

        const members = await BoardDB.getBoardMembers(boardId);
        if (!members.find(m => m.id === userId && m.role === 'owner')) {
            res.status(403).json({ 'message': 'Usuário não pertence ao quadro' });
            return
        }

        CardsDB.deleteCard(parseInt(cardId));

        res.json({ 'message': 'Card deletado com sucesso' });
    }
}