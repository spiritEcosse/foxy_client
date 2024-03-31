import {Paper, Typography} from "@mui/material";
import * as React from "react";
import NotFound from "./NotFound";
import InternalServerError from "./InternalServerError";
import Loading from "./Loading";
import PropTypes from "prop-types";
import Gallery from "./Gallery";

const PageDetails = ({seoData}) => {
    if (!seoData) {
        return <Loading/>;
    }

    if (seoData.status === 404) {
        return <NotFound/>;
    } else if (seoData.status === 500) {
        return <InternalServerError/>
    } else if (seoData.status !== 200) {
        return <div>{seoData.error}</div>;
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
