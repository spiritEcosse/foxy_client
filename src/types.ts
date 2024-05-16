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
        thumb?: string;
}

export interface ShippingRateType  {
        delivery_days_max: number;
        delivery_days_min: number;
}

export interface ItemType {
        id: number;
        title: string;
        src: string;
        slug: string;
        media: MediaType[];
        description: string;
        meta_description: string;
        price: number;
        delivery_days_min: number;
        delivery_days_max: number;
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

