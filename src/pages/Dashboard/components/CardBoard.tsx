import { Box, Button, styled, Typography, useTheme } from '@mui/material'
import React, { useState } from 'react'
import { Card } from '@/Types';
import { CardItem } from './CardItem';
import { CardModal } from './CardModal';
import { emptyCard } from '../template/emptyCard';

const Container = styled(Box)`
    width: fit-content;
    padding: ${({ theme }) => theme.spacing(2)};
    flex-grow: 1;
    
    display: flex;
    gap: ${({ theme }) => theme.spacing(2)};

    overflow-x: auto;
    overflow-y: auto;
`

const Column = styled(Box)`
    min-height: ${({ theme }) => theme.spacing(8)};
    height: fit-content;
    width: ${({ theme }) => theme.spacing(50)};
    padding: ${({ theme }) => theme.spacing(2) + " " + theme.spacing(1)};
    border-radius: 15px;
    background-color: ${({ theme }) => theme.palette.primary.light};

    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing(2)};  
    
    ${({ theme }) => theme.breakpoints.down('md')} {
        width: ${({ theme }) => theme.spacing(40)};
    }
`

type CardBoardProps = {
    cards: Card[]
}

export const CardBoard: React.FC<CardBoardProps> = ({ cards }) => {
    const [modalCard, setModalCard] = useState<Card | null>(null)

    const theme = useTheme()
    const getGroups = (cards: Card[]) => [...new Set(cards.map(card => card.group))]

    const createColumns = (cards: Card[]) => {
        const groups = getGroups(cards)
        const columns = groups.map(group => cards.filter(card => card.group === group))
        return columns
    }

    return (
        <Container>
            {createColumns(cards).map((column, index) => <Column key={index}>
                <Box sx={{
                    backgroundColor: theme.palette.primary.main, borderRadius: 5,
                    padding: `${theme.spacing(1)} ${theme.spacing(3)}`, width: "fit-content"
                }}>
                    <Typography variant='h5'>{column[0].group || "Sem grupo definido"}</Typography>
                </Box>
                {column.map((card, index) => <div key={index} onClick={() => setModalCard(card)}><CardItem data={card} /></div>)}
                <Button variant='contained' color='primary' onClick={()=>setModalCard({...emptyCard})}>Adicionar nova tarefa</Button>
            </Column>)}

            {modalCard != null ?
                <CardModal card={modalCard} setCard={setModalCard} groups={getGroups(cards)} isCreate={modalCard.id===-1}/> :
                <></>}
        </Container>
    )
}
