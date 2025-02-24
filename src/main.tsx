import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import { Home, Dashboard, BoardList } from './pages';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from "./assets/Theme";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AuthProvider } from './context/AuthContext';
import { BoardProvider } from './context/BoardContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route element={<BoardProvider />}>
                  <Route path="/boardlist" element={<BoardList />} />
                  <Route path="/dashboard/:id" element={<Dashboard />} />
                </Route>
                <Route path="*" element={<div>Erro 404: Página inexistente</div>} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </LocalizationProvider>
      </ThemeProvider>
  </StrictMode>
)
