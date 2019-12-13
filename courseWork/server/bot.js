const TelegramBot = require('node-telegram-bot-api');
const { botToken } = require('./config/config');

const Cart = require('./models/cart');

const bot = new TelegramBot(botToken);

const states = {
    '1': 'Новый',
    '2': 'В работе',
    '3': 'Выполнен'
}

async function getMessageForOrder(order) {
    const cart = await Cart.getById(order.cart);
    if (cart) {
        let msg = `*Заказ* #${order._id}\n*Статус* _${states[order.state.toString()]}_\n\n`;
        msg += 'Головоломки в заказе:\n';
        for (const item of cart.puzzles) {
            msg += `\t*${item.puzzle.name}*\n\t--*Кол-во* - ${item.count}, *цена (за ед.)* - _${item.puzzle.price}_\n\n`
        }
        msg += `Полная цена ${order.price} грн`;
        return msg;
    }
    return '';
}

function getMessageForAvailablePuzzle(puzzle) {
    const msg =
        `*${puzzle.name}* теперь доступен на полках нашео магазина!\n\n` +
        `Цена - ${puzzle.price}\n\n` +
        `Поспеши забрать свою радость! =)`;
    return msg;
}


const getReplyMarkUp = (puzzleId) => JSON.stringify({
    inline_keyboard: [
        [{ text: 'Открыть магазин!', url: `http://kubanutyi.herokuapp.com/puzzles/${puzzleId}` }],
    ]
})


const inteface = {
    onPuzzleAvailable: async (puzzle, telegramId) => {
        console.log(puzzle);
         try {
            bot.sendPhoto(telegramId, puzzle.photoUrl, {
                caption: getMessageForAvailablePuzzle(puzzle),
                parse_mode: 'Markdown', 
                reply_markup: getReplyMarkUp(puzzle._id)
            });
        } catch {
            bot.sendMessage(telegramId, getMessageForAvailablePuzzle(puzzle), {
                parse_mode: 'Markdown',
                reply_markup: getReplyMarkUp(puzzle._id)
            });
        }
    },

    onOrderStateChanged: async (order, telegramId) => {
        try {
            bot.sendPhoto(telegramId, 'Статус заказа изменён!\n\n' + await getMessageForOrder(order), { parse_mode: 'Markdown' });
        } catch (err) {

        }
    }
}

module.exports = inteface;