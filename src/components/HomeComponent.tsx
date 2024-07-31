import Gallery from "./Gallery";
import ApiGetMetaData from "./ApiGetMetaData";
import { useCallback, useState } from "react";
import { PageType, ResponseType } from "../types";
import * as React from "react";

export default function HomeComponent() {
  const [page, setPage] = useState({} as PageType);
  const [response, setResponse] = useState({ loading: true } as ResponseType);

  if (!response.loading) {
    if (response.code === 404) {
    } else if (response.code === 500) {
    } else if (response.code !== 200) {
    }
  }

  const handleFetchedPage = useCallback(
    ({ page, response }: { page: PageType; response: ResponseType }) => {
      setPage(page);
      setResponse(response);
    },
    [],
  );

  return (
    <div>
      <ApiGetMetaData slug="home" handleFetchedPage={handleFetchedPage} />
      <Gallery page={page} />
    </div>
  );
}
