import axios from 'axios';

class CustomError extends Error {
    code: number;

    constructor(code: number, message: string) {
        super(message);
        this.code = code;
        this.name = 'CustomError';
    }
}

export const fetchData = (path: string) => {
    return axios.get(`${import.meta.env.VITE_APP_SERVER_URL}/api/v1/${path}`)
        .then(response => {
            const isJson = response.headers['content-type']?.includes('application/json') ?? false;
            if (!isJson) {
                throw new Error('Response is not JSON.');
            }
            return response.data;
        })
        .catch(error => {
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
            throw new CustomError( code, message );
        });
};
