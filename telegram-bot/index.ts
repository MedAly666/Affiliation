import { Telegraf } from 'telegraf'

console.log('Starting Telegram bot...');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || '')


bot.command('start',async (ctx) => {
    try {
        console.log(`New user started the bot: ${ctx.from?.username} (${ctx.from?.id})`);

        await ctx.reply('Welcome! I am your bot.');

        await ctx.telegram.sendMessage('1299477536','Hello! I am your bot. How can I assist you today?');
    } catch (error) {
        console.error('Error handling /start command:', error);
        await ctx.reply('An error occurred while processing your request. Please try again later.');
    }
})

bot.launch()
    .then(() => {
        console.log('Telegram bot is running...');
    }
    )
    .catch((error) => {
        console.error('Error launching Telegram bot:', error);
    }
);