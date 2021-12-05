import config from 'config'
import { Telegraf } from 'telegraf'

const bot = new Telegraf(config.get('bot.token'))

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

bot.start(ctx => ctx.reply('mathzz'))
bot.launch()
