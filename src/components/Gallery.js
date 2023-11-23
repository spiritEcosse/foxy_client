import * as React from "react";
import {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import ImageListItem, {imageListItemClasses} from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import {Link, useLocation} from "react-router-dom";
import {PaginationItem, Paper, Typography} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import axios, {AxiosError} from "axios";
import NotFound from "./NotFound";
import InternalServerError from "./InternalServerError";
import Loading from "./Loading";

const theme = createTheme({
    breakpoints: {
        values: {
            mobile: 0,
            bigMobile: 350,
            tablet: 650,
            desktop: 900
        }
    },
    palette: {
        primary: {
            main: "#78C59B",
            contrastText: "#fff"
        },
        secondary: {
            main: "#003F5F",
            contrastText: "#fff"
        },
    },
})

const severUrl = process.env.REACT_APP_SERVER_URL;

const Gallery = ({seoData}) => {
    const [data, setData] = useState([]);
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const pageFromUrl = parseInt(query.get('page') || '1', 10);
    const [page, setPage] = useState(1);
    const [countPages, setCountPages] = useState(1);
    const [loading, setLoading] = useState(true);
    let limit = 25;
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async (page) => {
            setLoading(true);

            try {
                const apiUrl = `${severUrl}/item/?page=${pageFromUrl}`;
                const result = await axios.get(apiUrl);
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
        if (error.code === 404) {
            return <NotFound/>;
        } else if (error.code === 500) {
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
                <ThemeProvider theme={theme}>
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
                    <Box
                        sx={{
                            height: "100%",
                            display: "grid",
                            gridTemplateColumns: {
                                mobile: "repeat(1, 1fr)",
                                bigMobile: "repeat(2, 1fr)",
                                tablet: "repeat(3, 1fr)",
                                desktop: "repeat(4, 1fr)"
                            },
                            [`& .${imageListItemClasses.root}`]: {
                                display: "flex",
                                flexDirection: "column",
                                margin: "5px",
                            }
                        }}
                    >
                        {data.map((item) => (
                            <ImageListItem key={item.id} component={Link} to={`/item/${item.id}`}>
                                <img
                                    src={`${item.original}?w=200&h200&fit=crop&auto=format`}
                                    srcSet={`${item.original}?w=200&h=200&fit=crop&auto=format&dpr=2 2x`}
                                    alt={item.name}
                                    loading="lazy"
                                />
                                <ImageListItemBar
                                    title={item.name}
                                    subtitle={item.title}
                                    // position="below"
                                    actionIcon={
                                        <IconButton
                                            sx={{color: "rgba(255, 255, 255, 0.54)"}}
                                            aria-label={`info about ${item.name}`}
                                        >
                                            <InfoIcon/>
                                        </IconButton>
                                    }
                                />
                            </ImageListItem>
                        ))}
                    </Box>
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
                </ThemeProvider>
            </Paper>
        </div>
    );
}

export default Gallery;
