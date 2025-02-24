import { Card } from "@/Types";

export const emptyCard: Card = {
    id: -1,
    title: "",
    description: "",
    group: "",
    creationDate: new Date(),
    dueDate: new Date(),
    status: "Not Started",
    priority: "Low",
    responsible: null,
    archived: false,
    completedDate: undefined,
}