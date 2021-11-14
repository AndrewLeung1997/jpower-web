var TelegramBot = require('node-telegram-bot-api')
var token = '2123149644:AAHZ3vigrWnFYZmi58sVaaNcJ79bPKjP5NY'

var bot = new TelegramBot(token,{ polling: true })

var options = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: 'JPower 成人視頻',  url: 'https://www.jpower.tv' }],
            [{ text: 'BC Master 娛樂', url: 'http：//www.bcmvip.com/index.php?intr=2377' }],
            [{ text: 'Instgram', url: 'https://www.instagram.com' }]
        ]
    })
}

bot.onText(/\/start/, function (msg) {
    var chatId = msg.chat.id
    bot.sendMessage(chatId, `歡迎 ${msg.chat.username} 加入`, options)
})

bot.on('new_chat_members', function (message) {
    var chatId = message.chat.id
    var newMemberArray = message.new_chat_members
    newMemberArray.map((member)=>{
        bot.sendMessage(chatId, `歡迎 ${member.username}(${member.id}) 加入`, options)
    })
})

