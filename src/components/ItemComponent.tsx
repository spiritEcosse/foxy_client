import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import NotFound from './NotFound';
import InternalServerError from './InternalServerError';
import Loading from './Loading';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgVideo from 'lightgallery/plugins/video';
import '../assets/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-video.css';
import 'lightgallery/css/lightgallery.css';
import {
    ItemType,
    MediaType,
    MediaTypeEnum,
    ResponseType,
    ShippingRateType,
} from '../types';
import MetaDataComponent from './MetaDataComponent';
import { fetchCurrencyRate, fetchData } from '../utils';
import DOMPurify from 'dompurify';
import Button from '@mui/material/Button';
import { useCurrencyContext } from '../hooks/useCurrencyContext';
import { useBasketItemContext } from '../hooks/useBasketItemContext';
import LightGallery from 'lightgallery/react';
import { LightGallery as LightGalleryCore } from 'lightgallery/lightgallery';
import { useErrorContext } from '../hooks/useErrorContext';

interface MediaLightGalleryType {
    src?: string;
    type?: string;
    thumb: string;
    video?: {
        source: {
            src: string;
            type: string;
        }[];
        attributes: {
            preload: boolean;
            controls: boolean;
        };
    };
}

const ItemComponent = () => {
    const [item, setItem] = useState<ItemType>({} as ItemType);
    const [response, setResponse] = useState({
        loading: true,
    } as ResponseType);
    const { slug } = useParams();
    const [container, setContainer] = useState<HTMLElement | null>(null);
    const [conversionRate, setConversionRate] = useState(1);
    const { currency } = useCurrencyContext();
    const [media, setMedia] = useState<MediaLightGalleryType[]>([]);
    const [shippingRate, setShippingRate] = useState<ShippingRateType>(
        {} as ShippingRateType
    );
    const currentDate = new Date();
    const minDeliveryDate = new Date();
    const maxDeliveryDate = new Date();
    if (shippingRate) {
        minDeliveryDate.setDate(
            currentDate.getDate() + shippingRate.delivery_days_min
        );
        maxDeliveryDate.setDate(
            currentDate.getDate() + shippingRate.delivery_days_max
        );
    }
    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'long',
    };
    const onInit = useCallback((detail: { instance: LightGalleryCore }) => {
        if (detail) {
            detail.instance.openGallery();
        }
    }, []);
    const setContainerRef = useCallback((node: HTMLElement | null) => {
        if (node !== null) {
            setContainer(node);
        }
    }, []);
    const { addToBasket, removeFromBasket, isInBasket } =
        useBasketItemContext();
    const { setErrorMessage } = useErrorContext();

    const getLgComponent = useMemo(() => {
        if (container !== null && media) {
            return (
                <LightGallery
                    plugins={[lgThumbnail, lgVideo]}
                    dynamicEl={media}
                    closable={false}
                    showMaximizeIcon
                    thumbnail={true}
                    dynamic={true}
                    download={false}
                    onInit={onInit}
                    container={container}
                ></LightGallery>
            );
        }
        return null;
    }, [container, media, onInit]);

    const processMedia = (originalMedia: MediaType) => {
        if (originalMedia.thumb) {
            return; // If thumb already exists, no further processing is needed
        }
        originalMedia.thumb = `${originalMedia.src}?twic=v1/cover=96x76`;

        if (originalMedia.type === MediaTypeEnum.IMAGE) {
            originalMedia.src = `${originalMedia.src}?twic=v1/cover=900x900`;
        } else {
            originalMedia.src = `https://${import.meta.env.VITE_APP_CLOUD_NAME}${originalMedia.src.replace(/https?:\/\/[^/]+/, '')}`;
        }
    };

    useEffect(() => {
        if (currency !== 'EUR') {
            fetchCurrencyRate(currency)
                .then((rate) => setConversionRate(rate))
                .catch((error) => console.error(error));
        } else {
            setConversionRate(1);
        }
    }, [currency]);

    useEffect(() => {
        if (slug !== undefined) {
            fetchData('', `item/${slug}`, 'GET')
                .then((data) => {
                    data.image = data._media ? data._media[0].src : null;
                    if (data._media) {
                        const newMedia: MediaLightGalleryType[] = [];

                        for (const originalMedia of data._media) {
                            processMedia(originalMedia);

                            if (originalMedia.type === MediaTypeEnum.IMAGE) {
                                newMedia.push({
                                    src: originalMedia.src,
                                    thumb: originalMedia.thumb,
                                    type: 'image/jpg',
                                });
                            } else if (
                                originalMedia.type === MediaTypeEnum.VIDEO
                            ) {
                                newMedia.push({
                                    thumb: 'https://cdn.pixabay.com/photo/2019/04/24/21/55/cinema-4153289_1280.jpg',
                                    video: {
                                        source: [
                                            {
                                                src: originalMedia.src,
                                                type: 'video/mp4',
                                            },
                                        ],
                                        attributes: {
                                            preload: true,
                                            controls: true,
                                        },
                                    },
                                });
                            }
                        }
                        setMedia(newMedia);
                    }
                    setItem(data._item);

                    setResponse({
                        code: 200,
                        message: 'OK',
                        loading: false,
                    });
                })
                .catch(({ code, message }) => {
                    setErrorMessage(`Error fetching data: ${message}`);
                    setResponse({
                        code,
                        message,
                        loading: false,
                    });
                });

            fetchData('', `shippingrate/item/${slug}`, 'GET')
                .then((data) => {
                    setShippingRate(data.shipping);
                })
                .catch(({ code, message }) => {
                    setErrorMessage(`Error fetching data: ${message}`);
                    setResponse({
                        code,
                        message,
                        loading: false,
                    });
                });
        }
    }, [setErrorMessage, slug]);

    if (response.loading) {
        return <Loading />;
    }

    if (response.code === 404) {
        return <NotFound />;
    } else if (response.code === 500) {
        return <InternalServerError />;
    } else if (response.code !== 200) {
        return <div>{response.message}</div>;
    }

    const convertPrice = (price: number) => {
        return price * conversionRate;
    };

    return (
        <div style={{ padding: '20px', maxWidth: '100%' }}>
            <MetaDataComponent
                page={{
                    id: item.id,
                    title: item.title,
                    image: media.length > 0 ? media[0].src : '',
                    slug: item.slug,
                    description: item.description,
                    meta_description: item.meta_description,
                    canonical_url: '',
                }}
            />
            <Typography variant="h1" gutterBottom>
                {item.title}
            </Typography>
            <Paper elevation={3} style={{ padding: '20px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Paper
                            elevation={3}
                            style={{
                                padding: '20px',
                            }}
                        >
                            <div
                                style={{
                                    width: '100%',
                                    paddingBottom: '100%',
                                }}
                                ref={setContainerRef}
                            ></div>
                            {getLgComponent}
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <p>
                            Price:{' '}
                            {`${convertPrice(item.price).toLocaleString(
                                undefined,
                                {
                                    style: 'currency',
                                    currency: currency,
                                }
                            )}`}
                        </p>
                        {shippingRate && (
                            <p>
                                Delivery:{' '}
                                {minDeliveryDate.toLocaleDateString(
                                    'en-GB',
                                    options
                                )}{' '}
                                -{' '}
                                {maxDeliveryDate.toLocaleDateString(
                                    'en-GB',
                                    options
                                )}
                            </p>
                        )}
                        {isInBasket(item) ? (
                            <Button
                                variant="contained"
                                onClick={() => removeFromBasket(item)}
                            >
                                Remove from cart
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                onClick={() => addToBasket(item)}
                            >
                                Add to cart
                            </Button>
                        )}
                        <Typography variant="body1" paragraph component="div">
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(
                                        item.description
                                    ),
                                }}
                            />
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
};

export default ItemComponent;
