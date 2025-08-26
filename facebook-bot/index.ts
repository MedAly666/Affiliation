// file: forwarder.ts
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { NewMessage, NewMessageEvent } from 'telegram/events';
import { Api } from 'telegram/tl';
import getAliExpressAffiliateLink from './link-generator';

const apiId = Number(process.env.TELEGRAM_APP_API_ID) || 0;
const apiHash = process.env.TELEGRAM_APP_API_HASH || '';
const stringSession = new StringSession(process.env.TELEGRAM_STRING_SESSION || '');

async function sanatizeMessage(message: string) {
    // Extract affiliate link using regex
    let affiliateLink = message.match(/https:\/\/s.click.aliexpress.com\/e\/_[A-Za-z0-9]+/g)?.join('')
    console.log(' Affiliation Link : ', affiliateLink);
    if (!affiliateLink) {
        console.error('No Affiliation Link');
        return
    }
    // Get the original product link from the affiliate link
    const res = await fetch(affiliateLink, { redirect: "manual" });
    const location = res.headers.get("location");
    console.log("Original product link:", location);
    if (!location) {
        console.error('No original link.')
        return null;
    }
    // Generate the affiliate link using the original product link
    let myAffiliateLink = await getAliExpressAffiliateLink(location);
    console.log('My affiliation link:', myAffiliateLink);

    // remove unwanted parts from the message
    return message
        .split('\n')
        .map(msg => msg.replace('بوت يساعـدك للحصول على افضل سعر : ', '')
            .replace('t.me/ZedStoreOnline_bot', '')
            .replace('لي يراسلك ويقلك انا zed store ابلوكيه مباشرة ( نصاب ) ⚠️', '')
            .replace('بوت يساعـدك للحصول على تخفيض اي منتج :', '')
            .replace('بوت للحصول على تخفيضات اي منتج', '')
            .replace(/https:\/\/s.click.aliexpress.com\/e\/_[A-Za-z0-9]+/g, myAffiliateLink || '')
        )
        .join('\n')

}

async function getPageAccessToken(pageId: string, userAccessToken: string): Promise<string> {
    const url = `https://graph.facebook.com/v21.0/me/accounts?access_token=${userAccessToken}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
        throw new Error(`Error fetching Page tokens: ${JSON.stringify(data.error)}`);
    }

    const page = data.data.find((p: any) => p.id === pageId);
    if (!page) {
        throw new Error(`Page with ID ${pageId} not found in your account.`);
    }

    return page.access_token;
}

export async function forwardMessage(client: TelegramClient, message: Api.Message) {
    // Sanitize the message content
    const sanitizedMessage = await sanatizeMessage(message.message || "");
    if (!sanitizedMessage) {
        console.error("No message to forward after sanitization.");
        return;
    }
    console.log("Sanitized message:", sanitizedMessage);

    try {
        const pageId = process.env.FB_PAGE_ID || "";
        let pageAccessToken = process.env.FB_PAGE_ACCESS_TOKEN || "";
        const userAccessToken = process.env.FB_USER_ACCESS_TOKEN || ""; // long-lived user token (60 days)

        if (!pageId || !userAccessToken) {
            throw new Error("Facebook Page ID or FB_USER_ACCESS_TOKEN missing in environment variables.");
        }

        // If page token is not set, fetch a new one
        if (!pageAccessToken) {
            console.log("⚡ Fetching new Page Access Token...");
            pageAccessToken = await getPageAccessToken(pageId, userAccessToken);
            console.log("✅ Got fresh Page Access Token.");
        }

        // Post message to page
        const url = `https://graph.facebook.com/${pageId}/feed`;
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: sanitizedMessage,
                access_token: pageAccessToken,
            }),
        });

        const result = await response.json();

        if (result.error && result.error.code === 190) {
            console.warn("⚠️ Page Access Token expired, regenerating...");
            // regenerate and retry once
            pageAccessToken = await getPageAccessToken(pageId, userAccessToken);
            const retryRes = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: sanitizedMessage,
                    access_token: pageAccessToken,
                }),
            });
            const retryResult = await retryRes.json();

            if (retryResult.error) {
                console.error("❌ Still failed after regenerating:", retryResult.error);
                return retryResult;
            } else {
                console.log("✅ Successfully posted after regenerating token:", retryResult);
                return retryResult;
            }
        } else if (result.error) {
            console.error("❌ Error posting to Facebook:", result.error);
        } else {
            console.log("✅ Successfully posted to Facebook:", result);
        }

        return result;
    } catch (err) {
        console.error("Exception while posting to Facebook:", err);
    }
}


(async () => {
    const client = new TelegramClient(stringSession, apiId as number, apiHash, {
        connectionRetries: 5,
    });

    // Start the client
    await client.start({
        phoneNumber: async () => await prompt('Phone number: '),
        password: async () => await prompt('Password (if 2FA enabled): '),
        phoneCode: async () => await prompt('Code you received: '),
        onError: (err) => console.log(err),
    });

    console.log('Logged in!');

    const sourceEntity = await client.getEntity(process.env.TELEGRAM_SRC_CHANNEL_ID || '');
    client.addEventHandler(async (event) => {

        if (event instanceof NewMessageEvent) {
            const message = event.message;

            console.log(`New message received from ${message.senderId} in ${message.chatId}`);

            // Check if message is from our source channel
            if (message.chatId?.toString() === '-100' + sourceEntity.id.toString()) {
                console.log(`New message received .`);
                console.log(message)

                // Add small delay to avoid rate page_sizes
                await new Promise(resolve => setTimeout(resolve, 1000));

                await forwardMessage(client, message);
            }
        }
    }, new NewMessage({}));

    console.log(`Listening for new messages ...`);

})();