import { Card, CardStatus } from '@/Types'
import { Box, Chip, styled, Typography, useTheme } from '@mui/material'
import React from 'react'

const Container = styled(Box)`
    height: ${({ theme }) => theme.spacing(28)};
    width: 100%;
    
    padding: ${({ theme }) => theme.spacing(2)};
    border-radius: 5px;
    
    background-color: ${({ theme }) => theme.palette.background.default};
    border: 2px solid ${({ theme }) => theme.palette.grey[600]};
    

    display: flex;
    flex-direction: column;

    position: relative;

    &:hover {
        box-shadow: 2px 2px 12px -2px ${({ theme }) => theme.palette.grey[900]}C0;
    }

    cursor: pointer;
    user-select: none;
`

const PriorityIcon = styled('div') <{ color: "success" | "warning" | "error" }>`
    width: 1em;
    height: 1em;
    border-radius: 50%;
    background-color: ${({ theme, color }) => theme.palette[color].main};
    display: inline-block;
`

const DescriptionTypography = styled(Typography)`
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    line-height: 1.4em;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    text-align: justify;
    white-space: pre-line;
`

type CardItemProps = {
    data: Card
}

export const CardItem: React.FC<CardItemProps> = ({ data }) => {
    const theme = useTheme()

    const getPriorityColor = (priority: string): "success" | "warning" | "error" => {
        switch (priority) {
            case "Low":
                return "success"
            case "Medium":
                return "warning"
            case "High":
                return "error"
            default:
                return "warning"
        }
    }

    const statusTranslate: Record<CardStatus, string> = {
        "Not Started": "Não Começado",
        "In Progress": "Em Progresso",
        "Completed": "Completado"
    }


    return (
        <Container>
            <Typography variant='h5' sx={{ display: "flex", alignItems: "center", gap: theme.spacing(1), lineHeight: "1em" }} fontWeight={600}>
                <PriorityIcon color={getPriorityColor(data.priority)} />{data.title}
            </Typography>
            <Typography variant='subtitle2' sx={{ alignSelf: "end" }}>{data.creationDate.toDateString()}</Typography>
            <DescriptionTypography variant='body1'>{data.description}</DescriptionTypography>
            <Chip variant='filled' label={statusTranslate[data.status]} sx={{width: "fit-content", position:"absolute", bottom: theme.spacing(1), right: theme.spacing(1), backgroundColor: theme.palette.secondary.light}}/>
        </Container>
    )
}
