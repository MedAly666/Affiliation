import { TelegramClient } from 'telegram';
import { Api } from 'telegram/tl';


/**
 * Forward Telegram Message to my telegram channel
 * @param client 
 * @param message 
 * @returns 
 */
export async function forwardMessage(client: TelegramClient, message: Api.Message) {
    
    // Check if the message has media
    if (message.media) {
        return await client.sendFile(process.env.TELEGRAM_DEST_CHANNEL_ID || '', {
            file: message.media,
            caption: message.message,
        });
    } else {
        return await client.sendMessage(process.env.TELEGRAM_DEST_CHANNEL_ID || '', {
            message: message.message,
        });
    }
}