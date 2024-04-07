import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Grid, Paper, Typography} from '@mui/material';
import {useParams} from 'react-router-dom';
import NotFound from './NotFound';
import InternalServerError from './InternalServerError.js';
import Loading from './Loading';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import LightGallery from 'lightgallery/react';
import lgVideo from 'lightgallery/plugins/video';
import '../assets/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-video.css';
import 'lightgallery/css/lightgallery.css';
import {ItemType, MediaType, ResponseType} from '../types';
import MetaDataComponent from './MetaDataComponent';
import {fetchData} from '../utils';


const ItemComponent = () => {
    const [item, setItem] = useState<ItemType>({} as ItemType);
    const [response, setResponse] = useState({loading: true} as ResponseType);
    const {slug} = useParams();
    const lightGallery = useRef(null);
    const [container, setContainer] = useState<HTMLElement | null>(null);
    const onInit = useCallback((detail) => {
        if (detail) {
            lightGallery.current = detail.instance;
            lightGallery.current.openGallery();
        }
    }, []);
    const setContainerRef = useCallback((node: HTMLElement | null) => {
        if (node !== null) {
            setContainer(node);
        }
    }, []);

    const getLgComponent = () => {
        if (container !== null && item?.media) {
            return (
                <LightGallery
                    plugins={[lgThumbnail, lgVideo]}
                    dynamic
                    dynamicEl={item?.media}
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

    const processMedia = (media: MediaType) => {
        if (media.thumb) {
            return; // If thumb already exists, no further processing is needed
        }
        media.thumb = `${media.src}?twic=v1/cover=96x76`;

        if (!media.src?.includes('.mp4')) {
            media.src = `${media.src}?twic=v1/cover=900x600`;
        }
    };

    useEffect(() => {
        if (slug !== undefined) {
            fetchData(`item/${slug}`)
                .then(data => {
                    data.image = data.media ? data.media[0].src : null;
                    if (data.media) {
                        for (const media of data.media) {
                            processMedia(media);
                        }
                    }
                    setItem(data);
                    setResponse({code: 200, message: 'OK', loading: false});
                })
                .catch(({code, message}) => {
                    setResponse({code, message, loading: false});
                });
        }
    }, [slug]);

    if (response.loading) {
        return <Loading/>;
    }

    if (response.code === 404) {
        return <NotFound/>;
    } else if (response.code === 500) {
        return <InternalServerError/>;
    } else if (response.code !== 200) {
        return <div>{response.message}</div>;
    }

    return (
        <div style={{padding: '20px', maxWidth: '100%'}}>
            <MetaDataComponent page={{
                id: item.id,
                title: item.title,
                image: item.media[0].src,
                slug: item.slug,
                description: item.description,
                meta_description: item.meta_description,
                canonical_url: ''
            }}/>
            <Typography variant="h1" gutterBottom>
                {item.title}
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
                            {item?.description}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
};

export default ItemComponent;
