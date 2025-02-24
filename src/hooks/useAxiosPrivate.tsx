import { useEffect } from 'react'
import { useRefreshToken } from './useRefreshToken'
import { useAuth } from '@/context/AuthContext'
import { axiosWithCredentials } from '@/api/axios'

export const useAxios = () => {
    const refresh = useRefreshToken();
    const { user } = useAuth();

    useEffect(() => {

        const requestIntercept = axiosWithCredentials.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${user?.accessToken}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = axiosWithCredentials.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosWithCredentials(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosWithCredentials.interceptors.request.eject(requestIntercept);
            axiosWithCredentials.interceptors.response.eject(responseIntercept);
        }
    }, [user, refresh])

    return axiosWithCredentials;
}
