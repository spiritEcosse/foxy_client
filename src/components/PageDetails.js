import {Paper, Typography} from "@mui/material";
import * as React from "react";
import NotFound from "./NotFound";
import InternalServerError from "./InternalServerError";
import Loading from "./Loading";

const PageDetails = ({seoData}) => {
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
            <Paper elevation={3} style={{padding: '20px', marginBottom: '20px'}}>
                {seoData.description}
            </Paper>
        </div>
    )
}

export default PageDetails;
