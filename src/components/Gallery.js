import * as React from "react";
import {useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import {PaginationItem, Paper, Typography} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import axios, {AxiosError} from "axios";
import NotFound from "./NotFound";
import InternalServerError from "./InternalServerError";
import Loading from "./Loading";
import PropTypes from 'prop-types';

// import TwicPics components css
import '@twicpics/components/style.css'
import '../gallery.scss';

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
                const apiUrl = `${severUrl}/api/v1/item?page=${pageFromUrl}`;
                const result = await axios.get(apiUrl);
                const isJson = result.headers.get('content-type')?.includes('application/json');
                if (!isJson) {
                    throw new Error("Response is not JSON.");
                }

                setData(result.data.data || []);
                setCountPages(result.data ? Math.ceil(result.data.total / limit) : 1);
                setPage(result.data ? result.data.page : 1);
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

    return (
        <div style={{padding: '20px', maxWidth: '100%'}}>
            <Typography variant="h1" gutterBottom>
                {seoData?.title ?? "Gallery"}
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
                            <div className="galleryItem" key={item.id}
                                 style={{backgroundImage: `url(${item.src}?twic=v1/output=preview`}}>
                                <Link to={`/item/${item.slug}`}>
                                    <img data-twic-src={`image:${new URL(item.src).pathname}`} alt={item.title}/>
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

Gallery.propTypes = {
    seoData: PropTypes.shape({
        title: PropTypes.string,
    }),
};

export default Gallery;
