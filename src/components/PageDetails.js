import {Paper, Typography} from "@mui/material";
import * as React from "react";

const PageDetails = ({seoData}) => {
    if (!seoData) {
        return null;
    }
    return (
        <div style={{padding: '20px', maxWidth: '100%'}}>
            <Typography variant="h4" gutterBottom>
                {seoData.title}
            </Typography>
            <Paper elevation={3} style={{padding: '20px', marginBottom: '20px'}}>
                {seoData.description}
            </Paper>
        </div>
    )
}

export default PageDetails;
