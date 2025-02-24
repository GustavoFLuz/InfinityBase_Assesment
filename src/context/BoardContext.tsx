import { createContext, useState, useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { useAuth } from './AuthContext';
import { useAxios } from '@/hooks/useAxiosPrivate';
import { Boards, Card } from '@/Types';

interface BoardContextProps {
    availableBoards: Boards[];
    currentBoard: Boards | null;
    changeBoard: (boardId: number) => void;
    refresh: () => Promise<Boards[]>;
    currentCards: Card[] | null;
    addCard: (card: Card) => Promise<void>;
    updateCard: (card: Card) => Promise<void>;
    deleteCard: (cardId: number) => Promise<void>;
}

const BoardContext = createContext<BoardContextProps | undefined>(undefined);

export const BoardProvider = () => {
    const [availableBoards, setAvailableBoards] = useState<Boards[]>([]);
    const [currentBoard, setCurrentBoard] = useState<Boards | null>(null);
    const [currentCards, setCurrentCards] = useState<Card[] | null>(null);

    const { user, loading } = useAuth()
    const navigate = useNavigate();
    const axios = useAxios()

    const getAvailableBoards = (controller: AbortController): Promise<Boards[]> => {
        return new Promise<Boards[]>((resolve, reject) => {
            axios.get('/boards', { signal: controller.signal }).then(response => {
                resolve(response.data);
                setAvailableBoards(response.data);
                setCurrentBoard(response.data[0]);
            }).catch(error => {
                if (error.code == "ERR_CANCELED") return
                reject(error);
                console.error(error);
            });
        });
    }

    useEffect(() => {
        if (loading) return
        if (!user) {
            navigate("/")
            return
        }
        const controller = new AbortController()
        getAvailableBoards(controller)
        return () => {
            controller.abort();
        };
    }, [user, loading]);

    const changeBoard = (boardId: number) => {
        const board = availableBoards.find(board => board.id === boardId)
        if (board) {
            setCurrentBoard(board)
        }
    }

    const refresh = () => {
        const controller = new AbortController()
        return getAvailableBoards(controller)
    }

    useEffect(() => {
        if (!currentBoard) return
        const controller = new AbortController()
        axios.get(`/boards/${currentBoard.id}/cards`, { signal: controller.signal }).then(response => {
            setCurrentCards(response.data.map((card: any) => ({
                id: card.id,
                title: card.title,
                description: card.description,
                creationDate: new Date(card.creationDate),
                dueDate: new Date(card.dueDate),
                priority: card.priority,
                group: card.card_group,
                responsible: card.responsible_id,
                status: card.status,
                archived: Boolean(card.archived),
                completedDate: card.completed_date ? new Date(card.completed_date) : undefined
            })) as Card[]);
        }).catch(error => {
            if (error.code == "ERR_CANCELED") return
            console.error(error);
        });
    }, [currentBoard])

    const addCard = async (card: Card) => {
        if (!currentBoard) return Promise.resolve()
        return new Promise<void>((resolve, _) => {
            axios.post(`/boards/${currentBoard.id}/cards`, card).then((response) => {
                setCurrentCards(prev => prev ? [...prev, card] : [{ ...card, id: response.data.id }])
                resolve()
            }).catch(error => {
                if (error.code == "ERR_CANCELED") return
                console.error(error);
                resolve()
            });
        })
    }

    const updateCard = (card: Card) => {
        return new Promise<void>((resolve, _) => {
            axios.put(`/cards/${card.id}`, card).then(() => {
                setCurrentCards(prev => prev ? prev.map(c => c.id === card.id ? card : c) : null)
                resolve()
            }).catch(error => {
                if (error.code == "ERR_CANCELED") return
                console.error(error);
                resolve()
            });
        })
    }

    const deleteCard = (cardId: number) => {
        return new Promise<void>((resolve, _) => {
            axios.delete(`/cards/${cardId}`).then(() => {
                setCurrentCards(prev => prev ? prev.filter(c => c.id !== cardId) : null)
                resolve()
            }).catch(error => {
                if (error.code == "ERR_CANCELED") return
                console.error(error);
                resolve()
            });
        })
    }

    return (
        <BoardContext.Provider value={{ availableBoards, currentBoard, changeBoard, refresh, currentCards, addCard, updateCard, deleteCard }}>
            <Outlet />
        </BoardContext.Provider>
    );
};

export const useBoard = () => {
    const context = useContext(BoardContext);
    if (context === undefined) {
        throw new Error('useBoard must be used within a BoardProvider');
    }
    return context;
};