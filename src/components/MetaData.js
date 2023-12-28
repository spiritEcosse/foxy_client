import React from 'react';
import {Helmet} from 'react-helmet-async';

const MetaData = ({data}) => {
    const image = data.image ? data.image : `${document.location.origin}/logo.png`;
    return (
        <Helmet>
            <title>{data.title}</title>
            <meta name="description" content={data.meta_description}/>
            {/*<meta name="keywords" content="react, meta tags, seo"/>*/}
            {/*<meta name="author" content="Your Name"/>*/}
            <meta property="og:title" content={data.title}/>
            <meta property="og:description" content={data.meta_description}/>
            <meta property="og:image" content={image}/>
            <meta property="og:url" content={window.location.href}/>
            <meta name="twitter:title" content={data.title}/>
            <meta name="twitter:description" content={data.meta_description}/>
            <meta name="twitter:image" content={image}/>
            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:creator" content="@faithfishart"/>
        </Helmet>
    );
}

export default MetaData;
