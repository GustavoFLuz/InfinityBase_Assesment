import { createTheme } from "@mui/material";

export const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#72c9fb",
            light: "#b9d7ea",
            dark: "#1384bc",
        },
        secondary: {
            main: "#f5f574",
            dark: "#e3e347",
            light: "#f5f596"
        },
        background: {
            default: "#f0f0f0",
            paper: "#cecece"
        },
    },
});
