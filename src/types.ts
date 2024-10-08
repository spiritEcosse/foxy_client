export interface ResponseType {
    message?: string;
    code?: number;
    loading: boolean;
}

export enum MediaTypeEnum {
    IMAGE = 'image',
    VIDEO = 'video',
}

export interface MediaType {
    id: number;
    item_id: number;
    src: string;
    sort: number;
    type: MediaTypeEnum;
    thumb?: string;
}

export interface CountryType {
    id: number;
    title: string;
    code: string;
    created_at: Date;
    updated_at: Date;
}

export interface AddressType {
    id: number;
    address: string;
    country_id: number;
    country: CountryType;
    city: string;
    zipcode: string;
    user_id: number;
    created_at: Date;
    updated_at: Date;
}

export interface BasketItemType {
    id: number;
    item: ItemType;
    quantity: number;
    created_at: Date;
    updated_at: Date;
}

export interface OrderType {
    id: number;
    status: string;
    date: Date;
    total: number;
    total_ex_taxes: number;
    tax_rate: number;
    taxes: number;
    user_id: number;
    reference: string;
    created_at: Date;
    updated_at: Date;
    basket_id: number;
    address_id: number;
    basket_items: BasketItemType[];
    user: UserType;
    address: AddressType;
}

export interface BasketType {
    id: number;
    user_id: number;
    created_at: Date;
    updated_at: Date;
}

export interface FinancialDetailsType {
    id: number;
    tax_rate: number;
    gateway: string;
    gateway_merchant_id: string;
    merchant_id: string;
    merchant_name: string;
    created_at: Date;
    updated_at: Date;
}

export interface UserType {
    id: number;
    first_name: string;
    last_name: string;
    birthday: Date;
    total_spent: number;
    email: string;
    has_newsletter: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface ShippingRateType {
    delivery_days_max: number;
    delivery_days_min: number;
}

export interface ItemType {
    id: number;
    title: string;
    src: string;
    src_video?: string;
    slug: string;
    media: MediaType[];
    description: string;
    meta_description: string;
    price: number;
    delivery_days_min: number;
    delivery_days_max: number;
}

export interface PageType {
    id: number;
    title: string;
    image?: string;
    slug: string;
    description: string;
    meta_description: string;
    canonical_url: string;
}
