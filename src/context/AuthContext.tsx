import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '@/Types';
import axios, { axiosWithCredentials } from "@/api/axios"

type userParams = { name: string, password: string }

interface AuthContextType {
    register: ({ name, password }: userParams) => Promise<any>;
    login: ({ name, password }: userParams) => Promise<User>;
    logout: () => Promise<void>;
    user: User | null;
    setUser: (user: User | null) => void;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosWithCredentials.post('/user/refresh').then(response => {
            setIsAuthenticated(true)
            setUser(response.data)
            setLoading(false)
        }).catch(_ => {
            setIsAuthenticated(false)
            setLoading(false)
        })
    }, []);

    const register = async ({ name, password }: userParams) => {
        return axios.post('/user/register', { name, password });
    }

    const login = ({ name, password }: userParams): Promise<User> => {
        return new Promise<User>(async (resolve, reject) => {
            try {
                const response = await axios.post('/user/login', { name, password }, {withCredentials: true});
                if (response.status === 200) {
                    setIsAuthenticated(true);
                    setUser(response.data)
                    resolve(response.data)
                    setLoading(false)
                } else {
                    reject(response.data)
                    setLoading(false)
                }
            } catch (error) {
                console.error(error)
                reject(error)
                setLoading(false)
            }
        })
    };

    const logout = async () => {
        return new Promise<void>(async (resolve, reject) => {
            const response = await axiosWithCredentials.post('/user/logout');
            if (response.status === 200) {
                setUser(null);
                setIsAuthenticated(false);
                resolve();
            } else {
                reject(response.data);
            }
        });
    };

    return (
        <AuthContext.Provider value={{ register, login, logout, user, setUser, isAuthenticated, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};