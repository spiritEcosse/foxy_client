import {useContext, useEffect, useState} from 'react';
import {PageType, ResponseType} from '../types';
import MetaDataComponent from './MetaDataComponent';
import {fetchData} from '../utils';
import {LoginPopupContext} from './LoginPopupContext';


type HandleFetchedPageType = ({page, response}: { page: PageType, response: ResponseType }) => void;

const ApiGetMetaData = ({slug, handleFetchedPage}: {
    slug: string,
    handleFetchedPage: HandleFetchedPageType
}) => {
    const [page, setPage] = useState<PageType>({} as PageType);
    const {showLoginPopup, setShowLoginPopup} = useContext(LoginPopupContext);

    useEffect(() => {
        fetchData('', `page/${slug}`, 'GET', setShowLoginPopup)
            .then(data => {
                setPage(data);
                handleFetchedPage({page: data, response: {code: 200, message: 'OK', loading: false}});
            })
            .catch(({code, message}) => {
                handleFetchedPage({page: page, response: {code, message, loading: false}});
            });
    }, [slug, handleFetchedPage, page]);

    return (
        <div>
            <MetaDataComponent page={page}/>
        </div>
    );
};

export default ApiGetMetaData;
