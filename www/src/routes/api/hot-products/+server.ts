import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import aliexpress from '$lib/aliexpress';
import type { Product } from '$lib/types';

export const GET: RequestHandler = async ({ url }) => {
    const page_size = url.searchParams.get('page_size') || '25';
    const page_no = url.searchParams.get('page_no') || '1';
    const keywords = url.searchParams.get('keywords') ?? undefined;

    let advancedParams: Record<string, string | undefined> = {};

    const max_sale_price = url.searchParams.get('max_sale_price');
    const min_sale_price = url.searchParams.get('min_sale_price');
    const sortByType = url.searchParams.get('sortByType');

    const max = Number(max_sale_price);
    if (!isNaN(max) && max > 0) advancedParams.max_sale_price = String(max * 100);

    const min = Number(min_sale_price);
    if (!isNaN(min) && min > 0) advancedParams.min_sale_price = String(min * 100);

    if (sortByType) advancedParams.sort = sortByType;



    let data;
    try {
        let parameters = {
            page_no: page_no,
            page_size: page_size,
            keywords: keywords,
            target_currency: 'EUR',
            target_language: 'AR',
            ship_to_country: 'DZ',
            ...advancedParams
        }

        //console.log('hot data : ', parameters);

        data = await aliexpress.getHotProducts(parameters);

    } catch (err) {
        console.error('AliExpress API call failed:', err);
        return json({ error: 'Failed to fetch data from API' }, { status: 500 });
    }

    let products = data?.aliexpress_affiliate_hotproduct_query_response?.resp_result?.result?.products?.product;

    if (!products) {
        return json({ error: 'No products found' }, { status: 404 });
    }

    const formattedProducts: Product[] = await Promise.all(
        products.map(async (product: any): Promise<Product|undefined> => {
            const originalPrice = Number(product.target_original_price) || 0;
            const salePrice = Number(product.target_sale_price) || 0;7

            const affiliate = await aliexpress.getAffiliateLink(product.product_detail_url);  
            let affiliate_link = affiliate.aliexpress_affiliate_link_generate_response?.resp_result.result.promotion_links.promotion_link[0].promotion_link;

            if( !affiliate_link ) {
                console.error('Cant generate an affiliate link');
                return;
            }
            
            return {
                title: product.product_title,

                image: product.product_main_image_url,
                sale_price: salePrice,
                original_price: originalPrice,
                discount_percentage: Math.round(
                    ((originalPrice - salePrice) / (originalPrice || 1)) * 100
                ),
                images: product.product_small_image_urls?.string ?? [],
                affiliate_link: affiliate_link,
            };
        })
    );

    let cleandProducts = formattedProducts.filter(Boolean);

    return json(cleandProducts);
};
