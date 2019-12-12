const Telegraf = require('telegraf');
const { botToken } = require('./config/config');

const bot = new Telegraf(botToken);

const inteface = {
    onPuzzleAvailable: (puzzle, telegramId) => {
        Telegraf.reply(`Головоломка теперь доступна на полках нашео магазина! ${puzzle.name}\n
        Цена - ${puzzle.price}
        Тут ссылка`)
    }, 
}

module.exports = inteface;