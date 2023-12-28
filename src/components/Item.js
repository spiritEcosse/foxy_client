import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Grid, Paper, Typography} from '@mui/material';
import {useParams} from 'react-router-dom';
import NotFound from './NotFound';
import InternalServerError from "./InternalServerError";
import MetaData from "./MetaData";
import axios, {AxiosError} from "axios";
import Loading from "./Loading";
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import LightGallery from 'lightgallery/react';
import lgVideo from 'lightgallery/plugins/video';
// import styles
import '../item.css';
import './lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-video.css';
import 'lightgallery/css/lightgallery.css';

const serverUrl = process.env.REACT_APP_SERVER_URL;


const Item = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const [error, setError] = useState(null);
    const {id} = useParams();
    const lightGallery = useRef(null);
    const [container, setContainer] = useState(null);
    const onInit = useCallback((detail) => {
        if (detail) {
            lightGallery.current = detail.instance;
            lightGallery.current.openGallery();
        }
    }, []);
    const setContainerRef = useCallback((node) => {
        if (node !== null) {
            setContainer(node);
        }
    }, []);

    const getLgComponent = () => {
        if (container !== null && data.media) {
            return (
                <LightGallery
                    plugins={[lgThumbnail, lgVideo]}
                    dynamic
                    dynamicEl={data.media}
                    closable={false}
                    showMaximizeIcon
                    thumbnail={true}
                    download={false}
                    onInit={onInit}
                    container={container}
                >
                </LightGallery>
            );
        }
        return null;
    };

    const fetchItem = async (id) => {
        setLoading(true);

        try {
            const apiUrl = `${serverUrl}/item/${id}/`;
            const result = await axios.get(apiUrl);
            const isJson = result.headers.get('content-type')?.includes('application/json');
            if (!isJson) {
                throw new Error("Response is not JSON.");
            }

            const baseURL = `https://${process.env.REACT_APP_CLOUD_NAME}.twic.pics/`;
            const videoBaseURL = `https://${process.env.REACT_APP_CLOUD_NAME}.s3.eu-west-1.amazonaws.com/`;

            result.data.item.image = result.data.media ? result.data.media[0].src : null;
            if (result.data.media) {
                for (const item of result.data.media) {
                    if (item.src?.startsWith("https://")) {
                        break;
                    }
                    item.id = item.media_id;
                    delete item.media_id;
                    if (item.thumb === null) {
                        item.thumb = `${baseURL}${item.src}?twic=v1/cover=96x76`;
                    } else {
                        item.thumb = `${baseURL}${item.thumb}?twic=v1/cover=96x76`;
                    }

                    if (item.src?.includes(".mp4")) {
                        item.video = {
                            source: [{
                                src: `${videoBaseURL}${item.src}`,
                                type: "video/mp4",
                            }],
                            attributes: {
                                preload: false,
                                controls: false,
                                muted: true,
                                loop: true,
                                autoplay: true,
                            },
                        };
                        delete item.src;
                    } else {
                        item.src = `${baseURL}${item.src}?twic=v1/cover=900x600`;
                    }
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

    useEffect(() => {
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
            <Typography variant="h1" gutterBottom>
                {data.item.title}
            </Typography>
            <Paper elevation={3} style={{padding: '20px'}}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} style={{padding: '20px'}}>
                            <div
                                style={{width: '100%', paddingBottom: '100%'}}
                                ref={setContainerRef}
                            ></div>
                            {getLgComponent()}
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="body1" paragraph>
                            {data.item.description}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    )

};

export default Item;
