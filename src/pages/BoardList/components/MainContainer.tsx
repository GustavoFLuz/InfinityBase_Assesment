import { Box, styled } from "@mui/material";

export const MainContainer = styled(Box)`
    height: 70dvh;
    width: 400px;
    
    background-color: ${({ theme }) => theme.palette.primary.light}66;	
    border-radius: 50px;
    backdrop-filter: blur(5px);
    box-shadow: 
        0 4px 30px  ${({ theme }) => theme.palette.background.paper}66,
        inset 5px 5px 30px  ${({ theme }) => theme.palette.grey[700]}55;
    
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding: ${({ theme }) => theme.spacing(4)} ${({ theme }) => theme.spacing(2)};
    @media (max-width: ${({ theme }) => theme.breakpoints.values.sm}px) {
        width: 100%;
    }

`