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
import 'react-responsive-modal/styles.css';
import "../index.css";
import {Modal} from 'react-responsive-modal';

const serverUrl = process.env.REACT_APP_SERVER_URL;


const Item = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const [error, setError] = useState(null);
    const {id} = useParams();
    const [open, setOpen] = useState(false);

    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);

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
                        thumbnail: `${image}?width=1000&height=1000&fit=crop&auto=format`,
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

    const modalStyles = {
        modal: {
            'background': "none",
            "boxShadow": "none",
        }
    };

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
            <Modal open={open} center styles={modalStyles} showCloseIcon={false} onClose={onCloseModal}>
                <Carousel showArrows={true} emulateTouch={true} infiniteLoop={true} clas>
                    {data.images.map((image, index) => (
                        <div key={index}>
                            <img src={image.original}/>
                            <p className="legend">Legend 1</p>
                        </div>
                    ))}
                </Carousel>
            </Modal>
            <Typography variant="h4" gutterBottom>
                {data.item.title}
            </Typography>
            <Paper elevation={3} style={{padding: '20px', marginBottom: '20px'}}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <Carousel showArrows={true} emulateTouch={true} onClickItem={onOpenModal}
                                      infiniteLoop={true}>
                                {data.images.map((image, index) => (
                                    <div key={index} className="divHover">
                                        <img src={image.original}/>
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
