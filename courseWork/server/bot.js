const TelegramBot = require('node-telegram-bot-api');
const { botToken } = require('./config/config');

const bot = new TelegramBot(botToken);

const inteface = {
    onPuzzleAvailable: async (puzzle, telegramId) => {
        bot.sendMessage(telegramId, `Головоломка теперь доступна на полках нашео магазина! ${puzzle.name}\n
        Цена - ${puzzle.price}
        Тут ссылка`);
    }, 

    onOrderStateChanged: async (order, telegramId) => {
        bot.sendMessage(telegramId, `Статус вашего заказа изменен!\nЗаказ #${order._id} --тут список кубиков--\n
        Теперь его статус   *статус* ${order.state}`);
    }
}

module.exports = inteface;