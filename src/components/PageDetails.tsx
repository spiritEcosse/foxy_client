import { Paper, Typography } from '@mui/material';
import * as React from 'react';
import NotFound from './NotFound';
import InternalServerError from './InternalServerError';
import Loading from './Loading';
import { PageType, ResponseType } from '../types';
import DOMPurify from 'dompurify';

const PageDetails = ({
    page,
    response,
}: {
    page: PageType;
    response: ResponseType;
}) => {
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

    return (
        <div style={{ padding: '20px', maxWidth: '100%' }}>
            <Typography variant="h1" gutterBottom>
                {page.title}
            </Typography>
            <Paper
                elevation={3}
                style={{ padding: '20px', marginBottom: '20px' }}
            >
                <div
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(page.description),
                    }}
                />
            </Paper>
        </div>
    );
};

export default PageDetails;
