import axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';

const instance = axios.create();

class CustomError extends Error {
    code: number;

    constructor(code: number, message: string) {
        super(message);
        this.code = code;
        this.name = 'CustomError';
    }
}

// Add a request interceptor
instance.interceptors.request.use((config) => {
    return config;
}, (error) => {
    return Promise.reject(error);
});

const axiosCached = setupCache(instance);

export const fetchData =  async (path: string) => {
    try {
        const response = await axiosCached.get(
            `${import.meta.env.VITE_APP_SERVER_URL}/api/v1/${path}`, {cache: {interpretHeader:false}}
        );
        const isJson = response.headers['content-type']?.includes('application/json') ?? false;
        if (!isJson) {
            throw new Error('Response is not JSON.');
        }
        return response.data;
    } catch (error) {
        let message = 'Unknown Error';
        let code = 424;

        if (axios.isAxiosError(error)) {
            const axiosError = error;
            if (!axiosError.response) {
                message = 'No Server Response';
            } else if (axiosError.code === 'ERR_NETWORK') {
                message = 'Network Error';
            } else if (axiosError.response.status) {
                message = 'An error occurred';
                code = axiosError.response.status;
            } else if (axiosError.code) {
                code = parseInt(axiosError.code, 10) ?? 424;
            }
        }
        throw new CustomError(code, message);
    }
};
