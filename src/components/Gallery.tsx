import {useEffect, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {PaginationItem, Paper, Typography} from '@mui/material';
import Pagination from '@mui/material/Pagination';
import axios, {AxiosError} from 'axios';
import NotFound from './NotFound';
import InternalServerError from './InternalServerError';
import Loading from './Loading';
import {ItemType, PageType, ResponseType} from '../types';
import '@twicpics/components/style.css';
import '../assets/gallery.scss';


const Gallery = ({page}: { page: PageType }) => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const pageFromUrl = parseInt(query.get('page') ?? '1', 10);
    const [pageNumber, setPageNumber] = useState(1);
    const [countPages, setCountPages] = useState(1);
    const limit = 27;
    const [response, setResponse] = useState({loading: true} as ResponseType);
    const [data, setData] = useState<ItemType[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = `${import.meta.env.VITE_APP_SERVER_URL}/api/v1/item?page=${pageFromUrl}&limit=${limit}`;
                const responseAxios = await axios.get(apiUrl);
                const isJson = responseAxios.headers['content-type']?.includes('application/json') || false;
                if (!isJson) {
                    throw new Error('Response is not JSON.');
                }

                setData(responseAxios.data.data);
                setCountPages(responseAxios.data ? Math.ceil(responseAxios.data.total / limit) : 1);
                setPageNumber(responseAxios.data ? responseAxios.data.page : 1);
                setResponse({code: responseAxios.status, message: 'OK', loading: false});
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
                setResponse({code: code, message: message, loading: false});
            }
        };

        fetchData().then(() => {
        });
    }, [pageFromUrl, limit]);

    if (response.loading) {
        return <Loading/>;
    } else if (response.code === 404) {
        return <NotFound/>;
    } else if (response.code === 500) {
        return <InternalServerError/>;
    } else if (response.code !== 200) {
        return <div>{response.message}</div>;
    }

    return (
        <div style={{padding: '20px', maxWidth: '100%'}}>
            <button onClick={() => {
                throw new Error('An error occurred');
            }}>Break the world
            </button>
            <Typography variant="h1" gutterBottom>
                {page.title}
            </Typography>
            <Paper elevation={3} style={{padding: '20px'}}>
                <div style={{display: 'flex', justifyContent: 'center', marginBottom: '20px'}}>
                    <Pagination
                        page={pageNumber}
                        color="primary"
                        variant="outlined"
                        count={countPages}
                        renderItem={(item) => (
                            <PaginationItem
                                component={Link}
                                to={'/' + (item.page === 1 ? '' : '?page=' + item.page)}
                                {...item}
                            />
                        )}
                    />
                </div>
                <div className="galleryContainer">
                    {
                        data.map((item) => (
                            <div className="galleryItem" key={item.id}
                                style={{backgroundImage: `url(${item.src}?twic=v1/output=preview`}}>
                                <Link to={`/item/${item.slug}`}>
                                    <img
                                        data-twic-src={`image:${new URL(item.src).pathname}`}
                                        alt={item.title}/>
                                    <figcaption
                                        className="galleryCapt">{item.title}</figcaption>
                                </Link>
                            </div>
                        ))
                    }
                </div>
                <div style={{display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
                    <Pagination
                        page={pageNumber}
                        color="primary"
                        variant="outlined"
                        count={countPages}
                        renderItem={(item) => (
                            <PaginationItem
                                component={Link}
                                to={'/' + (item.page === 1 ? '' : '?page=' + item.page)}
                                {...item}
                            />
                        )}
                    />
                </div>
            </Paper>
        </div>
    );
};

export default Gallery;
