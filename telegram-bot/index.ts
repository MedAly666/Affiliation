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

async function forwardMessage(client: TelegramClient, message: Api.Message) {
    // Sanitize the message content
    const sanatizedMessage = await sanatizeMessage(message.message || '');
    if (!sanatizedMessage) {
        console.error('No message to forward after sanitization.');
        return;
    }
    console.log('Sanitized message:', sanatizedMessage);
    // Check if the message has media
    if (message.media) {
        return await client.sendFile(process.env.TELEGRAM_DEST_CHANNEL_ID || '', {
            file: message.media,
            caption: sanatizedMessage,
        });
    } else {
        return await client.sendMessage(process.env.TELEGRAM_DEST_CHANNEL_ID || '', {
            message: sanatizedMessage,
        });
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

                // Add small delay to avoid rate page_sizes
                await new Promise(resolve => setTimeout(resolve, 1000));

                await forwardMessage(client, message);
            }
        }
    }, new NewMessage({}));

    console.log(`Listening for new messages ...`);

})();