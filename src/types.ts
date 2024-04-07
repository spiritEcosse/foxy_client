export interface ResponseType {
        message?: string;
        code?: number;
        loading: boolean;
}

export interface MediaType  {
        id: number;
        item_id: number;
        src: string;
        sort: number;
        created_at: string;
        updated_at: string;
}

export interface ItemType {
        id: number;
        title: string;
        src: string;
        slug: string;
        media: MediaType[];
        description: string;
        meta_description: string;
}

export interface PageType  {
        id: number;
        title: string;
        image?: string;
        slug: string;
        description: string;
        meta_description: string;
        canonical_url: string;
}

