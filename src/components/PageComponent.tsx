import ApiGetMetaData from './ApiGetMetaData.js';
import React, {useState, useCallback} from 'react';
import {useParams} from 'react-router-dom';
import {PageType, ResponseType} from '../types';
import PageDetails from './PageDetails';

export default function PageComponent() {
    const {slug = ''} = useParams();
    const [page, setPage] = useState({} as PageType);
    const [response, setResponse] = useState({loading: true} as ResponseType);

    const handleFetchedPage = useCallback(({page, response}: { page: PageType, response: ResponseType }) => {
        setPage(page);
        setResponse(response);
    }, []);

    return (
        <div>
            <ApiGetMetaData slug={slug} handleFetchedPage={handleFetchedPage}/>
            <PageDetails page={page} response={response} />
        </div>
    );
}
