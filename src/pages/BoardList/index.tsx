import { useAuth } from '@/context/AuthContext'
import { useBoard } from '@/context/BoardContext'
import { useAxios } from '@/hooks/useAxiosPrivate'
import { Button, Container, List, ListItem, ListItemText, TextField, Typography, useTheme } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { MainContainer } from './components/MainContainer'


export const BoardList = () => {
    const [newBoardName, setNewBoardName] = useState<string>("")
    const theme = useTheme()
    const { user } = useAuth()
    const { availableBoards, refresh } = useBoard()
    const navigate = useNavigate()
    const axios = useAxios()

    const handleNavigate = (id: number) => () => {
        navigate(`/dashboard/${id}`)
    }

    if (!user) {
        return null
    }

    const handleCreateBoard = () => {
        axios.post("/boards/create", { name: newBoardName }).then(refresh)
    }

    return (
        <Container maxWidth="xl" sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <MainContainer>
                <Typography variant="h2" align="center" sx={{ color: theme.palette.primary.main, fontWeight: "bold" }}>
                    Olá, {user.name}
                </Typography>

                <List sx={{ maxHeight: "60%", overflow: "auto" }}>
                    <ListItem sx={{
                        cursor: "pointer",
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: 5,
                        marginBottom: theme.spacing(1),
                        display: "flex",
                        flexDirection: "column", gap: theme.spacing(1)
                    }}
                    >
                        <TextField sx={{ width: "100%" }} label="Criar novo quadro" value={newBoardName} onChange={(e) => setNewBoardName(e.target.value)} />
                        <Button onClick={handleCreateBoard} variant='contained' sx={{ height: "100%" }}>Adicionar</Button>
                    </ListItem>
                    {availableBoards?.map(board => (
                        <ListItem key={board.id} sx={{ cursor: "pointer", backgroundColor: theme.palette.primary.light, borderRadius: 5, marginBottom: theme.spacing(1) }}
                            onClick={handleNavigate(board.id)}
                        >
                            <ListItemText primary={board.name} secondary={board.role} />
                        </ListItem>
                    ))}

                </List>
            </MainContainer>
        </Container>
    )
}
