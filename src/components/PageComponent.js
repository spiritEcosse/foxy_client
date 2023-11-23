import ApiGetMetaData from "./ApiGetMetaData";
import * as React from "react";
import {useState} from "react";
import {useParams} from "react-router-dom";
import PageDetails from "./PageDetails";

export default function PageComponent() {
    const [seoData, setSeoData] = useState(null);
    const {slug} = useParams();

    const handleFetchedSeoData = data => {
        // Set the fetched data in the state
        setSeoData(data);
    };

    return (
        <div>
            <ApiGetMetaData slug={slug} onSeoDataFetched={handleFetchedSeoData}/>
            <PageDetails seoData={seoData}/>
        </div>
    );
}
