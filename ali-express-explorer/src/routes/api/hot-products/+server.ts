import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import aliexpress from '$lib/aliexpress';
import type { Product } from "$lib/types";


export const GET: RequestHandler = async ({ url }) => {
    // Get query parameters
    const limit = url.searchParams.get('limit') || '25';
    const page = url.searchParams.get('page') || '1';

    let data = await aliexpress.getProducts({
        page_no: page,
        page_size: limit,
        target_currency: 'EUR',
        target_language: 'AR',
        ship_to_country: 'DZ'
    });

    if (!data) {
        console.error('Failed to fetch data from AliExpress API', data);
        return json({ error: 'Failed to fetch data from API' }, { status: 500 });
    }

    if (data.error_response) {
        console.error('Error response from AliExpress API', data.error_response);
        return json({ error: data.error_response.msg || 'Unknown error' }, { status: 500 });
    }

    let products = data.aliexpress_affiliate_product_query_response.resp_result.result.products.product;


    //console.log(products);	

    products = products.map((product: any): Product => {
        return {
            title: product.product_title,
            url: product.product_detail_url,
            image: product.product_main_image_url,
            sale_price: Number(product.target_sale_price) || 0,
            original_price: Number(product.target_original_price) || 0,
            discount_percentage: Math.round(
                ((Number(product.target_original_price) || 0) - (Number(product.target_sale_price) || 0)) /
                (Number(product.target_original_price) || 1) * 100
            ),

            images: product.product_small_image_urls.string,

        };
    });

    return json(products);
};
