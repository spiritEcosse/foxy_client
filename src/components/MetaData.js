import React from 'react';
import {Helmet} from 'react-helmet-async';

const MetaData = ({data}) => {
    return (
        <Helmet>
            <title>{data.title}</title>
            <meta name="description" content={data.meta_description}/>
            {/*<meta name="keywords" content="react, meta tags, seo"/>*/}
            {/*<meta name="author" content="Your Name"/>*/}
            {/*<meta property="og:title" content="My Page Title"/>*/}
            {/*<meta property="og:description" content="This is a description of my page"/>*/}
            {/*<meta property="og:image" content="https://example.com/image.jpg"/>*/}
            {/*<meta property="og:url" content="https://example.com/my-page"/>*/}
            {/*<meta name="twitter:title" content="My Page Title"/>*/}
            {/*<meta name="twitter:description" content="This is a description of my page"/>*/}
            {/*<meta name="twitter:image" content="https://example.com/image.jpg"/>*/}
            {/*<meta name="twitter:card" content="summary_large_image"/>*/}
        </Helmet>
    );
}

export default MetaData;
