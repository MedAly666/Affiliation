import axios from 'axios';
import * as crypto from 'crypto';

const APP_KEY = process.env.ALIEXPRESS_APP_KEY!;
const APP_SECRET = process.env.ALIEXPRESS_APP_SECRET!;
const PID = process.env.ALIEXPRESS_PID!;
const API_URL = 'https://api-sg.aliexpress.com/sync';

type Params = Record<string, string>;

function generateSign(params: Params, secret: string): string {
    const keys = Object.keys(params).sort();
    const base = keys.map(k => `${k}${params[k]}`).join('');
    return crypto
        .createHmac('sha256', secret)
        .update(base)
        .digest('hex')
        .toUpperCase();
}

export default async function getAliExpressAffiliateLink(productUrl: string): Promise<string | null> {
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const params: Params = {
        app_key: APP_KEY,
        method: 'aliexpress.affiliate.link.generate',
        sign_method: 'hmac-sha256',
        timestamp,
        format: 'json',
        v: '2.0',
        tracking_id: PID,
        promotion_link_type: '0',       // Use '0' for product links (integer as string)
        source_values: productUrl,
    };

    params.sign = generateSign(params, APP_SECRET);

    try {
        const resp = await axios.post(API_URL, new URLSearchParams(params).toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
        });
        const links = resp.data
            ?.aliexpress_affiliate_link_generate_response
            ?.resp_result
            ?.result
            ?.promotion_links
            ?.promotion_link;
        if (Array.isArray(links) && links.length) return links[0].promotion_link;
        console.error('No promotion link returned:', resp.data);
    } catch (err: any) {
        console.error('API error:', err.response?.data || err.message);
    }
    return null;
}

