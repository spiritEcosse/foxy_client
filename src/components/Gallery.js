import * as React from "react";
import {useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import {PaginationItem, Paper, Typography} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import axios, {AxiosError} from "axios";
import NotFound from "./NotFound";
import InternalServerError from "./InternalServerError";
import Loading from "./Loading";
// import TwicPics components css
import '@twicpics/components/style.css'
import '../gallery.scss';

const domain = `https://${process.env.REACT_APP_CLOUD_NAME}.twic.pics`;

const severUrl = process.env.REACT_APP_SERVER_URL;

const Gallery = ({seoData}) => {
    const [data, setData] = useState([]);
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const pageFromUrl = parseInt(query.get('page') || '1', 10);
    const [page, setPage] = useState(1);
    const [countPages, setCountPages] = useState(1);
    const [loading, setLoading] = useState(false);
    let limit = 25;
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async (page) => {
            setLoading(true);

            try {
                const apiUrl = `${severUrl}/item/?page=${pageFromUrl}`;
                const result = await axios.get(apiUrl);
                const isJson = result.headers.get('content-type')?.includes('application/json');
                if (!isJson) {
                    throw new Error("Response is not JSON.");
                }

                setData(result.data.items);
                setCountPages(Math.ceil(result.data.count / limit));
                setPage(result.data.page);
            } catch (error) {
                console.error(error);
                if (!error?.response) {
                    setError({'message': "No Server Response"});
                } else if (error?.code === AxiosError.ERR_NETWORK) {
                    setError({'message': "Network Error"});
                } else if (error.response?.status !== 200) {
                    setError({'status': error.response?.status});
                } else if (error?.code) {
                    setError({'code': error.code});
                } else {
                    setError({'message': "Unknown Error"});
                }
            } finally {
                setLoading(false);
            }
        }

        fetchData(pageFromUrl);
    }, [pageFromUrl, limit]);

    if (loading) {
        return <Loading/>;
    }

    if (error) {
        if (error.status === 404) {
            return <NotFound/>;
        } else if (error.status === 500) {
            return <InternalServerError/>
        } else {
            return <div>An unexpected error occurred. Please try again later.</div>;
        }
    }
    if (!seoData) {
        return <Loading/>;
    }
    if ('error' in seoData) {
        if (seoData.code === 404) {
            return <NotFound/>;
        } else if (seoData.code === 500) {
            return <InternalServerError/>
        } else {
            return <div>An unexpected error occurred. Please try again later.</div>;
        }
    }

    return (
        <div style={{padding: '20px', maxWidth: '100%'}}>
            <Typography variant="h1" gutterBottom>
                {seoData.title}
            </Typography>
            <Paper elevation={3} style={{padding: '20px'}}>
                <div style={{display: 'flex', justifyContent: 'center', marginBottom: '20px'}}>
                    <Pagination
                        page={page}
                        color="primary"
                        variant="outlined"
                        count={countPages}
                        renderItem={(item) => (
                            <PaginationItem
                                component={Link}
                                to={`/${item.page === 1 ? '' : `?page=${item.page}`}`}
                                {...item}
                            />
                        )}
                    />
                </div>
                <div className="galleryContainer">
                    {
                        data.map((item) => (
                            <div className="galleryItem" key={item.item_id}
                                 style={{backgroundImage: `url(${domain}/${item.src}?twic=v1/output=preview)`}}>
                                <Link to={`/item/${item.item_id}`}>
                                    <img data-twic-src={`image:${item.src}`} alt={item.title}/>
                                    <figcaption className="galleryCapt">{item.title}</figcaption>
                                </Link>
                            </div>
                        ))
                    }
                </div>
                <div style={{display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
                    <Pagination
                        page={page}
                        color="primary"
                        variant="outlined"
                        count={countPages}
                        renderItem={(item) => (
                            <PaginationItem
                                component={Link}
                                to={`/${item.page === 1 ? '' : `?page=${item.page}`}`}
                                {...item}
                            />
                        )}
                    />
                </div>
            </Paper>
        </div>
    );
}

export default Gallery;
