import { useEffect, useState } from 'react'
import { Container } from './components/Container'
import { Drawer } from './components/Drawer'
import { MainBoard } from './components/MainBoard'
import { useParams } from 'react-router'
import { useBoard } from '@/context/BoardContext'
import { Members } from './components/Members'

const tabs = ["Dashboard", "Membros"]

export const Dashboard = () => {
  const [currentTab, setCurrentTab] = useState(tabs[0])
  const { id: boardId } = useParams()
  const { changeBoard } = useBoard()

  useEffect(() => {
    if (boardId) {
      changeBoard(parseInt(boardId))
    }
  }, [boardId])

  const getContent = () => {
    return {
      "Dashboard": <MainBoard />,
      "Membros": <Members id={boardId}/>,
    }[currentTab]
  }

  return (
    <Container>
      <Drawer tabs={tabs} currentTab={currentTab} setCurrentTab={setCurrentTab}>
        {getContent()}
      </Drawer>
    </Container>
  )
}
