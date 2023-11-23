import React, {useEffect, useState} from 'react';
import {Typography, Paper, Grid, Card} from '@mui/material';
import {useParams} from 'react-router-dom';
import NotFound from './NotFound';
import InternalServerError from "./InternalServerError";
import MetaData from "./MetaData";
import axios, {AxiosError} from "axios";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import {Carousel} from 'react-responsive-carousel';
import Loading from "./Loading";

const serverUrl = process.env.REACT_APP_SERVER_URL;


const Item = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const [error, setError] = useState(null);
    const {id} = useParams();

    useEffect(() => {
        const fetchItem = async (id) => {
            setLoading(true);

            try {
                const apiUrl = `${serverUrl}/item/${id}/`;
                const result = await axios.get(apiUrl);
                const isJson = result.headers.get('content-type')?.includes('application/json');
                if (!isJson) {
                    throw new Error("Response is not JSON.");
                }

                for (let i = 0; i < result.data.images.length; i++) {
                    let image = result.data.images[i].original
                    result.data.images[i] = {
                        original: image,
                        thumbnail: `${image}`,
                    }
                }
                setData(result.data);
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
        fetchItem(id);
    }, [id]);

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
            <MetaData data={data.item}/>
            <Typography variant="h4" gutterBottom>
                {data.item.title}
            </Typography>
            <Paper elevation={3} style={{padding: '20px', marginBottom: '20px'}}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <Carousel showArrows={true}>
                                {data.images.map((image, index) => (
                                    <div key={index}>
                                        <img src={image.thumbnail}/>
                                        <p className="legend">Legend 1</p>
                                    </div>
                                ))}
                            </Carousel>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="body1" paragraph>
                            {data.item.description}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
};

export default Item;
