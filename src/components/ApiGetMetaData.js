import React, {useEffect, useState} from 'react';
import MetaData from "./MetaData";
import axios from "axios";

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
