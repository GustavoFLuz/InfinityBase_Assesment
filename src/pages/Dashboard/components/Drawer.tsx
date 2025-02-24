import { useAuth } from '@/context/AuthContext';
import { useBoard } from '@/context/BoardContext';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import TableChartIcon from '@mui/icons-material/TableChart';
import { BottomNavigation, BottomNavigationAction, Box, Button, Divider, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useMediaQuery } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import { CSSObject, styled, Theme, useTheme } from '@mui/material/styles';
import * as React from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
const drawerWidth = 300;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(1),
    height: theme.spacing(8),
}));

const DrawerContainer = styled(MuiDrawer)(
    ({ theme }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        variants: [
            {
                props: ({ open }) => open,
                style: {
                    ...openedMixin(theme),
                    '& .MuiDrawer-paper': openedMixin(theme),
                },
            },
            {
                props: ({ open }) => !open,
                style: {
                    ...closedMixin(theme),
                    '& .MuiDrawer-paper': closedMixin(theme),
                },
            },
        ],
    }),
);

type DrawerProps = {
    children: React.ReactNode;
    tabs: string[];
    currentTab: string;
    setCurrentTab: (tab: string) => void;
}

export const Drawer: React.FC<DrawerProps> = ({ children, tabs, currentTab, setCurrentTab }) => {
    const [open, setOpen] = useState(false);

    const { logout } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();

    const { availableBoards } = useBoard();
    const { id: boardId } = useParams()

    const toggleDrawer = () => setOpen(!open)

    const handleLogout = async () => {
        logout()
            .then(() => { navigate("/") })
            .catch(err => { console.error(err) });
    }

    const handleChangeBoard = (boardId: number) => {
        navigate(`/dashboard/${boardId}`)
    }

    return (
        <Box sx={{ display: 'flex', width: "100vw", height: "100dvh" }}>
            {!isMobile ?
                <>
                    <DrawerContainer variant={"permanent"} open={open}>
                        <DrawerHeader>
                            <Box sx={{ justifyContent: open ? "initial" : "center", gap: 5, display: "flex" }}>
                                <Button onClick={handleLogout} size='large' variant='contained'>
                                    Sair <PowerSettingsNewIcon />
                                </Button>
                                <IconButton onClick={toggleDrawer} size='large'>
                                    <ChevronRightIcon sx={{ rotate: open ? "-180deg" : "0deg", transition: theme.transitions.easing.sharp }} />
                                </IconButton>
                            </Box>
                        </DrawerHeader>
                        <Divider />
                        <List>
                            {tabs.map((text) => (
                                <ListItem key={text} disablePadding sx={[{ display: 'block' }, currentTab == text ? { backgroundColor: theme.palette.primary.light } : {}]} >
                                    <ListItemButton sx={{ minHeight: 48, px: 2.5, justifyContent: open ? "initial" : "center" }} onClick={() => setCurrentTab(text)}>
                                        <ListItemIcon
                                            sx={{ minWidth: 0, justifyContent: 'center', mr: open ? 3 : "auto" }}
                                        >
                                            <InboxIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={text}
                                            sx={{ opacity: open ? 1 : 0 }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                        <Divider />
                        <List>
                            {availableBoards?.map((board) => (
                                <ListItem key={board.id}
                                    disablePadding
                                    sx={[{ display: 'block' }, boardId && board.id == parseInt(boardId) ? { backgroundColor: theme.palette.primary.light } : {}]}
                                    onClick={() => handleChangeBoard(board.id)}
                                >
                                    <ListItemButton
                                        sx={{ minHeight: 48, px: 2.5, justifyContent: open ? 'initial' : 'center', }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', mr: open ? 3 : "auto", }}>
                                            <TableChartIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={board.name}
                                            sx={{ opacity: open ? 1 : 0, }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </DrawerContainer>
                    <Box component="main" sx={{ flexGrow: 1, overflowX: "auto" }}>
                        {children}
                    </Box>
                </> :
                <>
                    <BottomNavigation
                        showLabels
                        sx={{ width: "100%", position: "fixed", bottom: 0, zIndex: 1000 }}

                    >
                        <BottomNavigationAction label="Sair" icon={<PowerSettingsNewIcon />} onClick={handleLogout} />
                        {tabs.map((text) => (
                            <BottomNavigationAction key={text} label={text} icon={<TableChartIcon />} onClick={() => setCurrentTab(text)} />
                        ))}
                        <BottomNavigationAction label="Lista de Quadros" icon={<FormatListBulletedIcon />} onClick={()=>navigate("/boardlist")} />
                    </BottomNavigation>
                    <Box component="main" sx={{ flexGrow: 1, overflowX: "auto" }}>
                        {children}
                    </Box>
                </>
            }
        </Box >
    );
}