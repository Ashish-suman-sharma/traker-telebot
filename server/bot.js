const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

// Replace with your Telegram bot token
const token = '7820539863:AAGBNXg8HOkFHNV31MNGmBKe19_IN3DneOw';
const bot = new TelegramBot(token, { polling: true });

// Path to the file where chat IDs will be stored
const chatIdsFilePath = path.join(__dirname, 'chat_ids.txt');

// Function to read chat IDs from the file
const readChatIds = () => {
    if (!fs.existsSync(chatIdsFilePath)) {
        return [];
    }
    const data = fs.readFileSync(chatIdsFilePath, 'utf8');
    return data.split('\n').filter(Boolean);
};

// Function to save chat ID to the file
const saveChatId = (chatId) => {
    const chatIds = new Set(readChatIds());
    chatIds.add(chatId);
    fs.writeFileSync(chatIdsFilePath, Array.from(chatIds).join('\n'));
};

// Handle /start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const welcomeMessage = '    Welcome! Click the button to open the tracker app. Track your habits, monitor daily progress, and schedule reminders to stay updated at the right time. 📈📅';
    const options = {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Open Website',
                        web_app: {
                            url: 'https://traker-telebot.vercel.app'
                        }
                    }
                ]
            ]
        }
    };
    bot.sendMessage(chatId, welcomeMessage, options);
    saveChatId(chatId);
});

// Schedule a message every night at 11 PM
cron.schedule('0 23 * * *', () => {
    const chatIds = readChatIds();
    chatIds.forEach(chatId => {
        bot.sendMessage(chatId, 'Please update tracker now. ⌚');
    });
});

console.log('Bot is running...');