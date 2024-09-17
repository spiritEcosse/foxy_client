import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PaginationItem, Paper, Typography } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import NotFound from './NotFound';
import InternalServerError from './InternalServerError';
import Loading from './Loading';
import { ItemType, PageType, ResponseType } from '../types';
import '@twicpics/components/style.css';
import '../assets/gallery.scss';
import { fetchData } from '../utils';
import { useErrorContext } from '../hooks/useErrorContext';

const Gallery = ({ page }: { page: PageType }) => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const pageFromUrl = parseInt(query.get('page') ?? '1', 10);
    const [pageNumber, setPageNumber] = useState(1);
    const [countPages, setCountPages] = useState(1);
    const limit = 27;
    const [response, setResponse] = useState({
        loading: true,
    } as ResponseType);
    const [data, setData] = useState<ItemType[]>([]);
    const { setErrorMessage } = useErrorContext();
    const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    const handleCanPlay = () => {
        setLoading(false);
    };

    const handleWaiting = () => {
        setLoading(true);
    };

    useEffect(() => {
        const path = `item?page=${pageFromUrl}&limit=${limit}`;
        fetchData('', path, 'GET')
            .then((data) => {
                setData(data.data);
                setCountPages(data ? Math.ceil(data.total / limit) : 1);
                setPageNumber(data ? data._page : 1);
                setResponse({
                    code: 200,
                    message: 'OK',
                    loading: false,
                });
            })
            .catch(({ code, message }) => {
                setErrorMessage(`Error fetching data: ${message}`);
                setResponse({ code, message, loading: false });
            });
    }, [pageFromUrl, limit, setErrorMessage]);

    if (response.loading) {
        return <Loading />;
    } else if (response.code === 404) {
        return <NotFound />;
    } else if (response.code === 500) {
        return <InternalServerError />;
    } else if (response.code !== 200) {
        return <div>{response.message}</div>;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '100%' }}>
            <Typography variant="h1" gutterBottom>
                {page.title}
            </Typography>
            <Paper elevation={3} style={{ padding: '20px' }}>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: '20px',
                    }}
                >
                    <Pagination
                        page={pageNumber}
                        color="primary"
                        variant="outlined"
                        count={countPages}
                        renderItem={(item) => (
                            <PaginationItem
                                component={Link}
                                to={
                                    '/' +
                                    (item.page === 1
                                        ? ''
                                        : '?page=' + item.page)
                                }
                                {...item}
                            />
                        )}
                    />
                </div>
                <div className="galleryContainer">
                    {data.map((item) => (
                        <div
                            className="galleryItem"
                            key={item.id}
                            style={{
                                backgroundImage:
                                    hoveredItemId === item.id && item.src_video
                                        ? 'none'
                                        : `url(${item.src}?twic=v1/output=preview)`,
                            }}
                            onMouseEnter={() => setHoveredItemId(item.id)}
                            onMouseLeave={() => setHoveredItemId(null)}
                            tabIndex={0}
                            role="button"
                        >
                            <Link to={`/item/${item.slug}`}>
                                {hoveredItemId === item.id && item.src_video ? (
                                    <>
                                        {loading && (
                                            <div className="spinner">
                                                <div className="loading-spinner"></div>
                                            </div>
                                        )}
                                        <video
                                            className="visible"
                                            muted
                                            autoPlay
                                            loop
                                            playsInline
                                            onCanPlay={handleCanPlay} // Video is ready to play
                                            onWaiting={handleWaiting} // Video is buffering/loading
                                        >
                                            <source
                                                src={item.src_video}
                                                type="video/mp4"
                                            />
                                            Your browser does not support the
                                            video tag.
                                        </video>
                                    </>
                                ) : (
                                    <img
                                        src={item.src}
                                        alt={item.title}
                                        style={{
                                            opacity:
                                                hoveredItemId === item.id
                                                    ? 0
                                                    : 1,
                                        }}
                                    />
                                )}
                                <figcaption className="galleryCapt">
                                    {item.title}
                                </figcaption>
                            </Link>
                        </div>
                    ))}
                </div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '20px',
                    }}
                >
                    <Pagination
                        page={pageNumber}
                        color="primary"
                        variant="outlined"
                        count={countPages}
                        renderItem={(item) => (
                            <PaginationItem
                                component={Link}
                                to={
                                    '/' +
                                    (item.page === 1
                                        ? ''
                                        : '?page=' + item.page)
                                }
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
