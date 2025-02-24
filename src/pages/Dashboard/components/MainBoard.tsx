import { Box, styled } from '@mui/material'
import { SearchBar } from './SearchBar'
import { CardBoard } from './CardBoard'
import { useBoard } from '@/context/BoardContext'
import { EmptyBoard } from './EmptyBoard'
import { useEffect, useState } from 'react'

const Container = styled(Box)`
    height: 100%;
    width: 100%;
    background-color: ${({ theme }) => theme.palette.background.default};

    display: flex;
    flex-direction: column;
    overflow-x: auto;
`

export const MainBoard = () => {
    const { currentCards } = useBoard()
    const [search, setSearch] = useState<string>("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [filteredCards, setFilteredCards] = useState(currentCards || [])

    useEffect(() => {
        if (currentCards === null) return

        setFilteredCards(
            currentCards.filter(card =>
                card.title.toLowerCase().includes(search.toLowerCase()) &&
                (statusFilter === "all" || card.status === statusFilter)
            ) || [])
    }, [search, statusFilter, currentCards])

    return (
        <Container>
            <SearchBar search={search} setSearch={setSearch} statusFilter={statusFilter} setStatusFilter={setStatusFilter}/>
            {currentCards === null ? <div>Carregando...</div> :
                <Box sx={{width:"100%"}}>
                    {
                    filteredCards.length === 0 ? <EmptyBoard /> :
                    <CardBoard cards={filteredCards}></CardBoard>
                    }
                </Box>}
        </Container>
    )
}
