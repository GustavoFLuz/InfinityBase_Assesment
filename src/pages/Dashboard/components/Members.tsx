import { useAuth } from '@/context/AuthContext';
import { useBoard } from '@/context/BoardContext';
import { useAxios } from '@/hooks/useAxiosPrivate';
import AddIcon from '@mui/icons-material/Add';
import { Box, IconButton, Select, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';

const CustomTableContainer = styled(TableContainer)`
    max-height: 70vh;
    width: ${({ theme }) => theme.spacing(75)};

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    overflow: auto;

    ${({ theme }) => theme.breakpoints.down('md')} {
        width: 100%;
    }
`

type MembersProps = {
    id?: string
}

export const Members: React.FC<MembersProps> = ({ id }) => {
    const [members, setMembers] = useState<{ name: string, id: string, role: string }[]>([])

    const [addMemberName, setAddMemberName] = useState<string>("")
    const [addMemberRole, setAddMemberRole] = useState<string>("")
    const [error, setError] = useState<string | null>(null)
    const axios = useAxios()
    const theme = useTheme()

    const { currentBoard } = useBoard()
    const { user } = useAuth()

    const getMembers = async (controller?: AbortController) => {
        axios.get(`/boards/${id}/members`, { signal: controller?.signal }).then(response => {
            setMembers(response.data)
        })
    }

    useEffect(() => {
        const controller = new AbortController()
        if (id) {
            getMembers(controller)
        }
        return () => {
            controller.abort()
        }
    }, [id])

    const addMember = () => {
        if (!addMemberName)
            return setError("Nome do membro não pode ser vazio")
        if (!addMemberRole)
            return setError("Cargo do membro não pode ser vazio")

        axios.post(`/boards/${id}/members`,
            { name: addMemberName, role: addMemberRole }).then(_ => {
                setError(null)
                getMembers()
            }).catch((error) => {
                setError("Erro ao adicionar membro")
                console.error(error)
            })
    }

    if (!id) {
        return <div>Selecione um board</div>
    }
    return (
        <>
            {!(members.length > 0) ? <div>Carregando...</div> :
                <>
                    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%"}}>
                        <CustomTableContainer >
                            {!(currentBoard?.owner_id == user?.id) ? null :
                                <>
                                    <Box sx={{ width: "100%",  background: theme.palette.background.paper, padding: "10px", borderRadius: "5px", display: "flex", justifyContent: "space-between" }}>
                                        <TextField
                                            id="outlined-basic"
                                            label="Adicionar membro"
                                            variant="outlined"
                                            sx={{ width: "40%" }}
                                            value={addMemberName}
                                            onChange={(e) => setAddMemberName(e.target.value)}
                                        />
                                        <Select
                                            native
                                            value={addMemberRole}
                                            onChange={(e) => setAddMemberRole(e.target.value)}
                                            inputProps={{
                                                name: 'age',
                                                id: 'age-native-simple',
                                            }}
                                            sx={{ width: "30%" }}

                                        >
                                            <option value="admin">Admin</option>
                                            <option value="user">Usuário</option>
                                            <option value="viewer">Visualizar</option>
                                        </Select>
                                        <IconButton onClick={addMember} size='large'>
                                            <AddIcon />
                                        </IconButton>
                                    </Box>
                                    {error ? <Box sx={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                        backgroundColor: theme.palette.background.paper,
                                        color: theme.palette.error.main,
                                        fontWeight: "bold",
                                    }}>{error}</Box> : null}
                                </>
                            }
                            <Table aria-label="simple table" sx={{ backgroundColor: theme.palette.background.paper }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="right">ID</TableCell>
                                        <TableCell >Nome</TableCell>
                                        <TableCell align="right">Cargo</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {members.map((membro) => (
                                        <TableRow
                                            key={membro.name}
                                        >
                                            <TableCell align="right">{membro.id}</TableCell>
                                            <TableCell component="th" scope="row">
                                                {membro.name}
                                            </TableCell>
                                            <TableCell align="right">{membro.role}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CustomTableContainer>
                    </Box>
                </>
            }
        </>
    )
}
