import { Card } from '@/Types'
import { Button } from '@mui/material'
import { useState } from 'react'
import { emptyCard } from '../template/emptyCard'
import { CardModal } from './CardModal'
import {Container} from "@mui/material"

export const EmptyBoard = () => {
    const [modalCard, setModalCard] = useState<Card | null>(null)
    return (
        <Container maxWidth='md'>
            <div>Não há tarefas criadas</div>
            <Button variant='contained' color='primary' onClick={() => setModalCard({ ...emptyCard })}>Adicionar nova tarefa</Button>
            {modalCard != null ?
                <CardModal card={modalCard} setCard={setModalCard} groups={[]} isCreate={modalCard.id === -1} /> :
                <></>}
        </Container>
    )
}
