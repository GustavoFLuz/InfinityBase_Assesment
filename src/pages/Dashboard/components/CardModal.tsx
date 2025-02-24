import { useBoard } from '@/context/BoardContext';
import { useAxios } from '@/hooks/useAxiosPrivate';
import { Card } from '@/Types';
import AdjustIcon from '@mui/icons-material/Adjust';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import FlagIcon from '@mui/icons-material/Flag';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import SaveIcon from '@mui/icons-material/Save';
import { Autocomplete, Box, IconButton, MenuItem, Modal, Select, styled, TextField, Tooltip, Typography } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

const Container = styled(Box)`
    width: fit-content;
    max-width: 100vw;
    height: 60dvh;
    padding: ${({ theme }) => `${theme.spacing(2)} ${theme.spacing(4)}`};

    background-color: ${({ theme }) => theme.palette.background.default};
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing(2)};

    overflow-y: auto;
`

const InfoTable = styled(Box)`
    gap: ${({ theme }) => theme.spacing(2)};
    
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;

    ${({ theme }) => theme.breakpoints.down('md')} {
        grid-template-columns: 1fr 1fr;
    }
`

type InfoTableItemProps = {
    children: React.ReactNode
}
const InfoTableItem: React.FC<InfoTableItemProps> = ({ children }) => <Typography variant='h6' sx={{ display: "flex", alignItems: "center", gap: "4px", lineHeight: "1em" }}>{children}</Typography>

type CardModalProps = {
    card: Card,
    setCard: React.Dispatch<React.SetStateAction<Card | null>>
    groups: string[];
    isCreate: boolean
}

export const CardModal: React.FC<CardModalProps> = ({ card, setCard, groups, isCreate }) => {
    const [newCard, setNewCard] = useState<Card>({ ...card })
    const [responsibleName, setResponsibleName] = useState<string>("")
    const { addCard, updateCard, deleteCard } = useBoard()
    const axios = useAxios()
    if (card === null) return null

    useEffect(() => {
        if (card === null || card.responsible == null) return
        const controller = new AbortController()

        axios.get(`/user/${card.responsible}`, { signal: controller.signal }).then(response => {
            setResponsibleName(response.data.name)
        }).catch(error => {
            if (error.code == "ERR_CANCELED") return
            console.error(error);
        });
    }, [card])

    useEffect(() => {
        const controller = new AbortController()
        if (responsibleName === "") return

        const timeout = setTimeout(() => {
            axios.get(`/user?name=${responsibleName}`, { signal: controller.signal }).then(response => {
                setNewCard(prev => ({ ...prev, responsible: response.data.id }))
            }).catch(error => {
                if (error.code == "ERR_CANCELED") return
                if (error.response.status === 404) {
                    alert("Usuário não encontrado")
                    return
                }
                console.error(error);
            });
        }, 1000)
        return () => {
            controller.abort()
            clearTimeout(timeout)
        }
    }, [responsibleName])

    const handleChange = async (key: string, value: any) => {
        if (key !== "responsible") {
            return setNewCard(prev => ({ ...prev, [key]: value }))
        }
        setResponsibleName(value)

    }

    const handleSave = async () => {
        if (!newCard.title) {
            alert("Título não pode ser vazio")
            return
        }
        if (!newCard.dueDate) {
            alert("Data final não pode ser vazia")
            return
        }
        if (!newCard.priority) {
            alert("Prioridade não pode ser vazio")
            return
        }
        
        (isCreate ? addCard(newCard) : updateCard(newCard)).then(() => setCard(null))
    }

    const handleDelete = async () => {
        isCreate ? setCard(null) : deleteCard(newCard.id).then(() => setCard(null))
    }
    return (
        <Modal
            aria-labelledby="modal-title"
            aria-describedby="modal-desc"
            open={newCard !== null}
            onClose={() => setCard(null)}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <Container>
                <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant='h4'>
                        <TextField value={newCard.title} label="Título"
                            onChange={(e) => handleChange("title", e.target.value)}
                        />
                    </Typography>
                    <div>
                        <Tooltip title="Deletar tarefa">
                            <IconButton color="error" onClick={() => handleDelete()}><DeleteIcon /></IconButton>
                        </Tooltip>
                        <Tooltip title={isCreate ? "Criar tarefa" : "Atualizar tarefa"}>
                            <IconButton color="primary" onClick={() => handleSave()}><SaveIcon /></IconButton>
                        </Tooltip>
                        <Tooltip title="Cancelar">
                            <IconButton onClick={() => setCard(null)}><CloseIcon /></IconButton>
                        </Tooltip>
                    </div>
                </div>
                <div style={{ flexGrow: 2 }}>
                    <InfoTable>
                        <InfoTableItem><CalendarMonthIcon />Data final</InfoTableItem>
                        <InfoTableItem>
                            <DateTimePicker
                                value={dayjs(newCard.dueDate.toISOString())}
                                onChange={(date) => handleChange("dueDate", date?.toDate())}
                            />
                        </InfoTableItem>
                        <InfoTableItem><CalendarMonthIcon />Data de criação</InfoTableItem>
                        <InfoTableItem>
                            <DateTimePicker
                                disabled
                                value={dayjs(newCard.creationDate.toISOString())}
                            />
                        </InfoTableItem>
                        <InfoTableItem><AdjustIcon />Status</InfoTableItem>
                        <InfoTableItem>
                            <Select
                                value={newCard.status}
                                fullWidth
                                onChange={(e) => handleChange("status", e.target.value)}
                            >
                                <MenuItem value="Not Started">Não começado</MenuItem>
                                <MenuItem value="In Progress">Em progresso</MenuItem>
                                <MenuItem value="Completed">Completado</MenuItem>
                            </Select>
                        </InfoTableItem>
                        <InfoTableItem><GroupIcon />Grupo</InfoTableItem>
                        <InfoTableItem>
                            <Autocomplete
                                freeSolo
                                options={groups}
                                value={newCard.group}
                                onChange={(_, newValue) => handleChange("group", newValue)}
                                renderInput={(params) => <TextField {...params} />}
                                fullWidth
                            />
                        </InfoTableItem>
                        <InfoTableItem><FlagIcon />Prioridade</InfoTableItem>
                        <InfoTableItem>
                            <Select
                                value={newCard.priority}
                                fullWidth
                                onChange={(e) => handleChange("priority", e.target.value)}
                            >
                                <MenuItem value="Low">Baixa</MenuItem>
                                <MenuItem value="Medium">Média</MenuItem>
                                <MenuItem value="High">Alta</MenuItem>
                            </Select>
                        </InfoTableItem>
                        <InfoTableItem><PersonIcon />Responsável</InfoTableItem>
                        <InfoTableItem>
                            <TextField value={responsibleName} fullWidth onChange={(e) => handleChange("responsible", e.target.value)} />
                        </InfoTableItem>
                    </InfoTable>
                </div>
                <div style={{ flexGrow: 2 }}>
                    <TextField label="Descrição" value={newCard.description} fullWidth multiline onChange={(e) => handleChange("description", e.target.value)} />
                </div>
            </Container>
        </Modal>
    )
}
