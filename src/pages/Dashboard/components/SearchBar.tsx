import { Box, MenuItem, Select, styled, TextField } from '@mui/material'

const Container = styled(Box)`
    height: ${({ theme }) => theme.spacing(8)};
    width: 100%;
    
    padding: ${({ theme }) => theme.spacing(2)};
    border-radius: 5px;
    
    background-color: ${({ theme }) => theme.palette.background.default};
    border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
    display: flex;
    align-items: baseline;
    gap: ${({ theme }) => theme.spacing(2)};
    position: relative;
`

type SearchBarProps = {
  search: string,
  setSearch: (search: string) => void,
  statusFilter: string,
  setStatusFilter: (status: string) => void
}

export const SearchBar: React.FC<SearchBarProps> = ({ search, setSearch, statusFilter, setStatusFilter }) => {
  return (
    <Container>
      <Select
        label="Filtrar por status"
        onChange={e => setStatusFilter(e.target.value)}
        value={statusFilter}
        variant='standard'
      >
        <MenuItem value="all">Mostrar todos</MenuItem>
        <MenuItem value="Not Started">Não Começado</MenuItem>
        <MenuItem value="In Progress">Em progresso</MenuItem>
        <MenuItem value="Completed">Completado</MenuItem>
      </Select>
      <TextField size='small' fullWidth
        onChange={e => setSearch(e.target.value)}
        value={search}
        label='Filtrar por título' variant='standard'
      ></TextField>
    </Container>
  )
}
