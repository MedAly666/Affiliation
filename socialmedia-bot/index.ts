import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { NewMessage, NewMessageEvent } from 'telegram/events';
import { publishPost } from './facebook';
import { forwardMessage } from './telegram';
import { sanatizeMessage } from './utils';

const TELEGRAM_APP_API_ID = Number(process.env.TELEGRAM_APP_API_ID) || 0;
const TELEGRAM_APP_API_HASH = process.env.TELEGRAM_APP_API_HASH || '';
const TELEGRAM_STRING_SESSION = new StringSession(process.env.TELEGRAM_STRING_SESSION || '');

(async () => {

    console.log('Starting...');

    console.log('Initializing client...');
    const client = new TelegramClient(TELEGRAM_STRING_SESSION, TELEGRAM_APP_API_ID as number, TELEGRAM_APP_API_HASH, {
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
                
                console.log('Start sanitizing the message');
                const sanitizedMessage = await sanatizeMessage(message.message || "");
                if (!sanitizedMessage) {
                    console.error("No message to forward after sanitization.");
                    return;
                }
                console.log("Sanitized message:", sanitizedMessage);
                message.message = sanitizedMessage;

                // Add small delay to avoid rate page_sizes
                await new Promise(resolve => setTimeout(resolve, 1000));

                console.log('Forwading the message to my telegram channel');
                await forwardMessage(client, message);

                console.log('Publishing the message to my facebook page');
                await publishPost(message)
            }
        }
    }, new NewMessage({}));

    console.log(`Listening for new messages ...`);

})();