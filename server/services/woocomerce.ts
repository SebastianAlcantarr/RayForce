// @ts-ignore
import fallbackImages from '@/data/images.json';
import { Buffer } from 'buffer'

function getConfig() {
    const config = useRuntimeConfig()

    return {
        WOO_URL: config.wooUrl,
        WOO_KEY: config.wooKey,
        WOO_SECRET: config.wooSecret,
        BASE_URL: `${config.wooUrl}/wp-json/wc/v3`
    }
}

interface WooRequestOptions {
    params?: Record<string, string | number>;
    cache?: RequestCache;
}

async function wooFetch<T>(endpoint: string, options: WooRequestOptions = {}): Promise<T> {
    const { BASE_URL, WOO_KEY, WOO_SECRET } = getConfig()

    const url = new URL(`${BASE_URL}${endpoint}`);

    if (options.params) {
        Object.entries(options.params).forEach(([key, value]) => {
            url.searchParams.set(key, String(value));
        });
    }

    const auth = Buffer.from(`${WOO_KEY}:${WOO_SECRET}`).toString('base64');

    const response = await fetch(url.toString(), {
        headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/json',
        },
        cache: options.cache || 'no-store',
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`WooCommerce API Error [${response.status}]:`, errorText);
        throw new Error(`WooCommerce API Error: ${response.status}`);
    }

    return response.json();
}