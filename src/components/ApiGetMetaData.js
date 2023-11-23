import React, {useEffect, useState} from 'react';
import MetaData from "./MetaData";
import axios, {AxiosError} from "axios";

const severUrl = process.env.REACT_APP_SERVER_URL;

const ApiGetMetaData = ({slug, onSeoDataFetched}) => {
    const [page, setPage] = useState({});

    useEffect(() => {
        const fetchPage = async (slug) => {
            try {
                const apiUrl = `${severUrl}/page/${slug}/`;
                const result = await axios.get(apiUrl);
                setPage(result.data);
                onSeoDataFetched(result.data);
            } catch (error) {
                console.error(error);
                if (!error?.response) {
                    onSeoDataFetched({'error': {'message': "No Server Response"}});
                } else if (error?.code === AxiosError.ERR_NETWORK) {
                    onSeoDataFetched({'error': {'message': "Network Error"}});
                } else if (error.response?.status !== 200) {
                    onSeoDataFetched({'error': true, "status": error.response?.status});
                } else if (error?.code) {
                    onSeoDataFetched({'error': true, 'code': error.code});
                } else {
                    onSeoDataFetched({'error': {'message': "Unknown Error"}});
                }
            }
        }
        fetchPage(slug);
    }, [slug]);

    return (
        <div>
            <MetaData data={page}/>
        </div>
    );
}

export default ApiGetMetaData;
