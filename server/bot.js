const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');
const express = require('express');

// Replace with your bot token
const token = '7820539863:AAGBNXg8HOkFHNV31MNGmBKe19_IN3DneOw';

// Replace with your domain and port
const domain = 'https://traker-telebot-1.onrender.com';
const port = process.env.PORT || 3000;

// Create a bot instance
const bot = new TelegramBot(token, { webHook: true });
bot.setWebHook(`${domain}/bot${token}`);

// Path to the file where chat IDs will be stored
const chatIdsFilePath = path.join(__dirname, 'chat_ids.txt');
const localStorageFilePath = path.join(__dirname, 'local_storage.json');

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
    const chatIds = readChatIds();
    if (!chatIds.includes(chatId.toString())) {
        chatIds.push(chatId.toString());
        fs.writeFileSync(chatIdsFilePath, chatIds.join('\n'));
    }
};

// Handle /start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const welcomeMessage = 'Welcome! Click the button to open the tracker app. Track your habits, monitor daily progress, and schedule reminders to stay updated at the right time. 📅';
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

// Function to read data from local storage file
const readLocalStorageData = () => {
    if (!fs.existsSync(localStorageFilePath)) {
        return {};
    }
    const data = fs.readFileSync(localStorageFilePath, 'utf8');
    return JSON.parse(data);
};

// Endpoint to save data
const app = express();
app.use(express.json());
app.post('/save-data', (req, res) => {
    const data = req.body;
    let existingData = {};

    if (fs.existsSync(localStorageFilePath)) {
        existingData = JSON.parse(fs.readFileSync(localStorageFilePath, 'utf8'));
    }

    const updatedData = { ...existingData, ...data };
    fs.writeFileSync(localStorageFilePath, JSON.stringify(updatedData, null, 2));
    res.sendStatus(200);
});

// Schedule a task to check schedules every minute
cron.schedule('* * * * *', () => {
    const now = moment().tz('Asia/Kolkata');
    const localStorageData = readLocalStorageData();
const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');
const express = require('express');

// Replace with your bot token
const token = '7820539863:AAGBNXg8HOkFHNV31MNGmBKe19_IN3DneOw';

// Replace with your domain and port
const domain = 'https://traker-telebot-1.onrender.com';
const port = process.env.PORT || 3000;

// Create a bot instance
const bot = new TelegramBot(token, { webHook: true });
bot.setWebHook(`${domain}/bot${token}`);

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
    const chatIds = readChatIds();
    if (!chatIds.includes(chatId.toString())) {
        chatIds.push(chatId.toString());
        fs.writeFileSync(chatIdsFilePath, chatIds.join('\n'));
    }
};

// Handle /start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const welcomeMessage = '    Welcome! Click the button to open the tracker app. Track your habits, monitor daily progress, and schedule reminders to stay updated at the right time. 📅';
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

// Schedule a message every night at 11:10 PM IST
cron.schedule('40 17 * * *', () => {
    const now = moment().tz('Asia/Kolkata');
    if (now.hour() === 23 && now.minute() === 10) {
        const chatIds = readChatIds();
        chatIds.forEach(chatId => {
            bot.sendMessage(chatId, 'Please update tracker now. ⌚');
        });
    }
});

console.log('Bot is running...');

// Start the server
const app = express();
app.use(express.json());
app.post(`/bot${token}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
    Object.keys(localStorageData).forEach(chatId => {
        const { schedules } = localStorageData[chatId];
        if (schedules && schedules.length > 0) {
            schedules.forEach(schedule => {
                const eventDateTime = moment(schedule.datetime);
                if (eventDateTime.diff(now, 'minutes') === 10) {
                    bot.sendMessage(chatId, `Reminder: ${schedule.name} is starting in 10 minutes.`);
                }
            });
        }
    });
});

console.log('Bot is running...');

// Start the server
app.post(`/bot${token}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});