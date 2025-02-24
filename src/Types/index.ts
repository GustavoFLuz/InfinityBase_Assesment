export type CardStatus = "Not Started" | "In Progress" | "Completed";
export type CardPriority = "Low" | "Medium" | "High";

export type Card = {
    id: number;
    title: string;
    description: string;
    group: string;
    creationDate: Date;
    dueDate: Date;
    status: CardStatus;
    priority: CardPriority;
    responsible: string | null;
    archived: boolean;
    completedDate: undefined | Date;
}

export type User = {
    id: number;
    name: string;
    accessToken: string;
}

export type Boards = {
    id: number;
    name: string;
    owner_id: number;
    role: string;
}