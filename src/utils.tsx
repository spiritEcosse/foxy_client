import axios from 'axios';
import {setupCache} from 'axios-cache-interceptor';

const instance = axios.create();
const axiosCached = setupCache(instance);

export class CustomError extends Error {
    code: number;

    constructor(code: number, message: string) {
        super(message);
        this.code = code;
        this.name = 'CustomError';
    }
}

export const fetchCurrencyRate = async (currency: string) => {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
    const data = await response.json();
    return data.rates[currency];
};

export const fetchData = async (url: string, path: string, method: 'GET' | 'POST' | 'DELETE' | 'PUT' = 'GET', body?: Record<string, unknown>, disableCache = false) => {
    try {
        const response = await axiosCached({
            method,
            url: url || `${import.meta.env.VITE_APP_SERVER_URL}/api/v1/${path}`,
            data: body,
            cache: disableCache ? false : {interpretHeader: false},
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth')}`
            }
        });
        const isJson = response.headers['content-type']?.includes('application/json') ?? false;
        if (!isJson) {
            throw new Error('Response is not JSON.');
        }
        return response.data;
    } catch (error) {
        console.log(error);
        let message = 'Unknown Error';
        let code = 1000;

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
                code = parseInt(axiosError.code, 10) ?? code;
            }
        }
        if (message === 'No Server Response') {
            localStorage.removeItem('auth');
            localStorage.setItem('showLoginPopup', 'true');
            window.dispatchEvent(new Event('storage'));
        }
        throw new CustomError(code, message);
    }
};
