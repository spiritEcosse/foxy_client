import {useEffect, useState} from 'react';
import axios, {AxiosError} from 'axios';
import {PageType, ResponseType} from '../types';
import MetaDataComponent from './MetaDataComponent';

type HandleFetchedPageType = ({page, response}: { page: PageType, response: ResponseType }) => void;

const ApiGetMetaData = ({slug, handleFetchedPage}: {
    slug: string,
    handleFetchedPage: HandleFetchedPageType
}) => {
    const [page, setPage] = useState<PageType>({} as PageType);

    useEffect(() => {
        const fetchPage = async (slug: string) => {
            try {
                const apiUrl = `${import.meta.env.VITE_APP_SERVER_URL}/api/v1/page/${slug}`;
                const responseAxios = await axios.get(apiUrl);
                const isJson = responseAxios.headers['content-type']?.includes('application/json') || false;
                if (!isJson) {
                    throw new Error('Response is not JSON.');
                }
                setPage(responseAxios.data);
                handleFetchedPage({page: responseAxios.data, response: {code: responseAxios.status, message: 'OK', loading: false}});
            } catch (error) {
                let message = 'Unknown Error';
                let code = 424;

                const axiosError = error as AxiosError;
                if (!axiosError?.response) {
                    message = 'No Server Response';
                } else if (axiosError?.code === AxiosError.ERR_NETWORK) {
                    message = 'Network Error';
                } else if (axiosError.response?.status !== 200) {
                    message = 'An error occurred';
                    code = axiosError.response?.status;
                } else if (axiosError?.code) {
                    code = parseInt(axiosError.code, 10);
                }
                handleFetchedPage({page: page, response: {code: code, message: message, loading: false}});
            }
        };
        fetchPage(slug).then(() => {});
    }, [slug, handleFetchedPage, page]);

    return (
        <div>
            <MetaDataComponent page={page}/>
        </div>
    );
};

export default ApiGetMetaData;
