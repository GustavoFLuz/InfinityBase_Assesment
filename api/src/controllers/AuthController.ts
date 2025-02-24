import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserDB } from '../database/UserDB';
import { config } from 'dotenv';
config();

export class AuthController {
    static async login(req: Request, res: Response) {
        const { name, password } = req.body;

        const user = await UserDB.authenticateUser(name, password);
        if (!user) {
            res.status(401).json({ 'message': 'Credenciais inválidas' });
            return
        }
        const accessToken = jwt.sign(
            { "name": user.name, "id": user.id },
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: '1h' }
        );
        const refreshToken = jwt.sign(
            { "name": user.name, "id": user.id },
            process.env.REFRESH_TOKEN_SECRET!,
            { expiresIn: '7d' }
        );

        UserDB.updateRefreshToken(user.id, refreshToken);

        res.cookie('jwt', refreshToken, { httpOnly: true, secure: process.env.environment === "PRODUCTION", maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.json({ name: user.name, id: user.id, accessToken });
    }

    static async register(req: Request, res: Response) {
        const { name, password } = req.body;
        if (!name || !password) {
            res.status(400).json({ 'message': 'Nome de usuário e senha são necessários' });
            return
        }

        const existingUser = await UserDB.checkExistingUser(name);
        if (existingUser) {
            res.status(400).json({ 'message': 'Nome de usuário já existe' });
            return
        }

        const success = await UserDB.createUser(name, password);

        if (!success) {
            res.status(500).json({ 'message': 'Erro ao criar usuário' });
            return
        }
        res.json({ 'message': 'Usuário criado com sucesso' });
    }

    static async logout(req: Request, res: Response) {
        const refreshToken = req.cookies.jwt;
        if (!refreshToken) {
            res.status(400).json({ 'message': 'Nenhum token fornecido' });
            return
        }
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, (err: jwt.VerifyErrors | null, user: any) => {
            if (err) {
                res.status(400).json({ 'message': 'Token inválido' });
                return
            }
            UserDB.updateRefreshToken(user.id, '');
            res.clearCookie('jwt');
            res.json({ 'message': 'Usuário desconectado com sucesso' });
        });

    }

    static async refresh(req: Request, res: Response) {
        const refreshToken = req.cookies.jwt;
        if (!refreshToken) {
            res.status(400).json({ 'message': 'Nenhum token fornecido' });
            return
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, async (err: jwt.VerifyErrors | null, user: any) => {
            if (err) {
                res.status(400).json({ 'message': 'Token inválido' });
                return
            }

            const accessToken = jwt.sign(
                { "name": user.name, "id": user.id },
                process.env.ACCESS_TOKEN_SECRET!,
                { expiresIn: '1h' }
            );
            res.json({ name: user.name, id: user.id, accessToken });
        });
    }

    static async getUserByID(req: Request, res: Response) {
        const id = req.params.id;
        const user = await UserDB.getUserById(parseInt(id));
        if (!user) {
            res.status(404).json({ 'message': 'Usuário não encontrado' });
            return
        }
        res.json({ name: user.name, id: user.id });
    }

    static async getUserByName(req: Request, res: Response) {
        const name = req.query.name;
        const user = await UserDB.getUserByName(name as string);
        if (!user) {
            res.status(404).json({ 'message': 'Usuário não encontrado' });
            return
        }
        res.json({ name: user.name, id: user.id });
    }
}