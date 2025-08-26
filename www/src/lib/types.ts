export type Product = {
    title: string;
    sale_price: number;
    original_price: number;
    discount_percentage: number;
    image: string;
    url?: string;
    affiliate_link: string;
    images: string[];
};

export type QueryOptions = {
  category_ids?: string;
  fields?: string;
  keywords?: string;
  max_sale_price?: number; // in cents
  min_sale_price?: number; // in cents
  page_no?: number; // default = 1
  page_size?: number; // default = 20, range 1–50
  platform_product_type?: 'ALL' | 'PLAZA' | 'TMALL';
  sort?: 'SALE_PRICE_ASC' | 'SALE_PRICE_DESC' | 'LAST_VOLUME_ASC' | 'LAST_VOLUME_DESC';
  target_currency?: string; // e.g. 'USD', 'EUR'
  target_language?: string; // e.g. 'EN', 'RU'
  delivery_days?: string; // e.g. '3', '5', '7', '10'
  ship_to_country?: string; // e.g. 'US', 'DZ'
  promotion_name?: string;
};
