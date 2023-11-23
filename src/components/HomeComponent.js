import Gallery from "./Gallery";
import ApiGetMetaData from "./ApiGetMetaData";
import * as React from "react";
import {useState} from "react";

export default function HomeComponent() {
    const [seoData, setSeoData] = useState(null);

    const handleFetchedSeoData = data => {
        // Set the fetched data in the state
        setSeoData(data);
    };
    return (
        <div>
            <ApiGetMetaData slug='home' onSeoDataFetched={handleFetchedSeoData}/>
            <Gallery seoData={seoData}/>
        </div>
    );
}
