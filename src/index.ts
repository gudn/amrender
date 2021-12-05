import config from 'config'
import { Telegraf } from 'telegraf'
import { convert_, OutputFormat } from 'am-parse'

const amToTex = (s: string) => convert_(s, OutputFormat.Latex, '')

const bot = new Telegraf(config.get('bot.token'))

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

bot.start(ctx => ctx.reply('mathzz'))
bot.on('text', ctx => {
  const am = ctx.message.text
  const tex = amToTex(am)
  ctx.reply(tex)
})

bot.launch()
