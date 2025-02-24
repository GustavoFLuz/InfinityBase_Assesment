export type User = {
    id: number;
    name: string;
    password: string
    refreshToken: string;
}

export type Board = {
    id: number;
    name: string;
    owner_id: number;
}

export type BoardUser = {
    user_id: number;
    board_id: number;
    role: string;
}

export interface UserRequest extends Request {
    user?: { id: number, name: string };
}

export type CardStatus = "Not Started" | "In Progress" | "Completed";
export type CardPriority = "Low" | "Medium" | "High";
export type Card = {
    title: string;
    description: string;
    group: string;
    creationDate: string;
    dueDate: string;
    status: CardStatus;
    priority: CardPriority;
    responsible: string;
    archived: boolean;
    completedDate: undefined | Date;
    board_id?: number;
    id?: number;
}