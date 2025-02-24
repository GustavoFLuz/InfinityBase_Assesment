import axios from '@/api/axios';
import { useAuth } from '@/context/AuthContext';

export const useRefreshToken = () => {
    const { setUser } = useAuth();

    const refresh = async () => {
        const response = await axios.post('/user/refresh', {}, { withCredentials: true });

        if (response.status === 200) {
            setUser(response.data);
            return response.data;
        }
        throw new Error('Failed to refresh token');
    }

    return refresh
}
