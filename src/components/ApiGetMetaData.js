import React, {useEffect, useState} from 'react';
import MetaData from "./MetaData";
import axios, {AxiosError} from "axios";

const severUrl = process.env.REACT_APP_SERVER_URL;

const ApiGetMetaData = ({slug, onSeoDataFetched}) => {
    const [page, setPage] = useState({});

    useEffect(() => {
        const fetchPage = async (slug) => {
            try {
                const apiUrl = `${severUrl}/api/v1/page/${slug}`;
                const response = await axios.get(apiUrl);
                const isJson = response.headers.get('content-type')?.includes('application/json');
                if (!isJson) {
                    throw new Error("Response is not JSON.");
                }
                setPage(response.data);
                onSeoDataFetched({ ...response.data, status: response.status });
            } catch (error) {
                console.error(error);
                if (!error?.response) {
                    onSeoDataFetched({'error': "No Server Response", 'status': 424});
                } else if (error?.code === AxiosError.ERR_NETWORK) {
                    onSeoDataFetched({'error': "Network Error", 'status': 424});
                } else if (error.response?.status !== 200) {
                    onSeoDataFetched({'error': "Unknown Error", "status": error.response?.status});
                } else if (error?.code) {
                    onSeoDataFetched({'error': "Unknown Error", 'status': error.code});
                } else {
                    onSeoDataFetched({'error': "Unknown Error", "status": 424});
                }
            }
        }
        fetchPage(slug);
    }, [slug]);

    return (
        <div>
            <MetaData data={page}/>
        </div>
    )
}

export default ApiGetMetaData;
