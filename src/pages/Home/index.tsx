import { useAuth } from '@/context/AuthContext'
import { Box, Button, Container, Link, TextField, Typography, useTheme } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { SignInContainer } from './components/SignInContainer'

type ErrorTypographyProps = { children: React.ReactNode }
const ErrorTypography: React.FC<ErrorTypographyProps> = ({ children }) =>
    <Typography variant="body2" sx={{ color: "error.main", whiteSpace: "pre-line", alignSelf: "flex-start" }}>
        {children}
    </Typography>

export const Home = () => {
    const { register, login, isAuthenticated } = useAuth()

    const [isSignIn, setIsSignIn] = useState(true)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [errors, setErrors] = useState({ password: "", confirmPassword: "", login: "" })

    const theme = useTheme()
    const navigate = useNavigate()

    useEffect(() => {
        if (isAuthenticated)
            navigate("/boardlist")
    }, [isAuthenticated])

    const handleToggle = () => {
        setIsSignIn(!isSignIn)
        resetForm()
    }

    const resetForm = () => {
        setUsername("")
        setPassword("")
        setConfirmPassword("")
        setErrors({ password: "", confirmPassword: "", login: "" })
    }

    const handlePasswordChange = (value: string) => {
        setErrors(prev => {
            let passwordErrors = ""
            if (value.length < 8) passwordErrors += "A senha deve ter pelo menos 8 caracteres\n"
            if (!value.match(/[0-9]/)) passwordErrors += "A senha deve ter pelo menos um número\n"
            if (!value.match(/[A-Z]/)) passwordErrors += "A senha deve ter pelo menos uma letra maiúscula\n"
            if (!value.match(/[a-z]/)) passwordErrors += "A senha deve ter pelo menos uma letra minúscula\n"
            prev.password = passwordErrors

            prev.confirmPassword = value != confirmPassword ? "As senhas não coincidem" : ""
            return prev
        })
        setPassword(value)
    }
    const handlePasswordConfirmChange = (value: string) => {
        setErrors(prev => {
            prev.confirmPassword = value != password ? "As senhas não coincidem" : ""
            return prev
        })
        setConfirmPassword(value)
    }

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        login({ name: username, password })
            .catch(err => {
                setErrors(prev => ({...prev, login: err.response.data}))
            })
    }

    const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (errors.password.length) return setErrors(prev => ({ ...prev, login: "Senha inválida" }))
        if (errors.confirmPassword.length) return setErrors(prev => ({ ...prev, login: "As senhas não coincidem" }))

        register({ name: username, password })
            .then(handleLogin)
            .catch(err => {
                setErrors(prev => ({ ...prev, login: err?.response?.data?.message }))
            })
    }

    return (
        <Container maxWidth="xl" sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <SignInContainer>
                <Box className="header">
                    <Typography variant="h2" align="center" sx={{ color: theme.palette.primary.main, fontWeight: "bold" }}>
                        Tasks
                    </Typography>
                </Box>
                {
                    isSignIn ?
                        <form className="form" onSubmit={handleLogin}>
                            <TextField
                                label="Nome"
                                type="text"
                                margin='dense' fullWidth
                                value={username} onChange={(e) => setUsername(e.target.value)}
                            />
                            <TextField
                                label="Senha"
                                type="password"
                                margin='dense' fullWidth
                                value={password} onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button variant="contained" sx={{ borderRadius: "10px", width: "60%", mt: 2 }} type="submit" >
                                Entrar
                            </Button>
                            {errors.login.length ?
                                <ErrorTypography>{errors.login}</ErrorTypography> :
                                null}
                        </form> :
                        <form className="form" onSubmit={handleRegister}>
                            <TextField
                                label="Nome"
                                type="text"
                                margin='dense' fullWidth required
                                value={username} onChange={(e) => setUsername(e.target.value)}
                            />
                            <TextField
                                label="Senha"
                                type="password"
                                margin='dense' fullWidth required
                                value={password} onChange={(e) => handlePasswordChange(e.target.value)}
                            />
                            {errors.password.length ?
                                <ErrorTypography>{errors.password}</ErrorTypography> :
                                null}
                            <TextField
                                label="Confirme sua Senha"
                                type="password"
                                margin='dense' fullWidth required
                                value={confirmPassword} onChange={(e) => handlePasswordConfirmChange(e.target.value)}
                            />
                            {errors.confirmPassword.length ?
                                <ErrorTypography>{errors.confirmPassword}</ErrorTypography> :
                                null}
                            <Button variant="contained" sx={{ borderRadius: "10px", width: "60%", mt: 2 }} type="submit">
                                Cadastrar
                            </Button>
                            {errors.login.length ?
                                <ErrorTypography>{errors.login}</ErrorTypography> :
                                null}
                        </form>
                }
                <Box className="footer">
                    <Typography variant="body2" align="center" sx={{ color: theme.palette.grey[500] }}>
                        {isSignIn ?
                            <>Não tem uma conta? <Link sx={{ cursor: "pointer" }} onClick={handleToggle}>Cadastre-se</Link></> :
                            <>Já tem uma conta? <Link sx={{ cursor: "pointer" }} onClick={handleToggle}>Entre</Link></>
                        }
                    </Typography>
                </Box>
            </SignInContainer>
        </Container>
    )
}
