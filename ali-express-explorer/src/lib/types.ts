export type Product = {
    title: string;
    sale_price: number;
    original_price: number;
    discount_percentage: number;
    image: string;
    url: string;
    affiliation_link?: string;
    images: string[];
};