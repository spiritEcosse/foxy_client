import React from 'react';
import {Helmet} from 'react-helmet-async';
import {PageType} from '../types';

const MetaDataComponent = ({page}: {page: PageType}) => {
    const image = page.image ? page.image : `${document.location.origin}/logo.png`;
    return (
        <Helmet>
            <title>{page.title}</title>
            <meta name="description" content={page.meta_description}/>
            {/* <meta name="keywords" content="react, meta tags, seo"/> */}
            {/* <meta name="author" content="Your Name"/> */}
            <meta property="og:title" content={page.title}/>
            <meta property="og:description" content={page.meta_description}/>
            <meta property="og:image" content={image}/>
            <meta property="og:url" content={window.location.href}/>
            <meta name="twitter:title" content={page.title}/>
            <meta name="twitter:description" content={page.meta_description}/>
            <meta name="twitter:image" content={image}/>
            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:creator" content="@faithfishart"/>
        </Helmet>
    );
};

export default MetaDataComponent;
