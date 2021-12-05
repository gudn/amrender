import config from 'config'
import { Telegraf } from 'telegraf'
import { convert_, OutputFormat } from 'am-parse'
import fetch from 'cross-fetch'

const amToTex = (s: string) => `$\\displaystyle ${convert_(s, OutputFormat.Latex, '')}$`

const bot = new Telegraf(config.get('bot.token'))

process.once('SIGINT', () => bot.stop('SIGINT'))

process.once('SIGTERM', () => bot.stop('SIGTERM'))

bot.start(ctx => ctx.reply('mathzz'))
bot.on('text', async ctx => {
  const am = ctx.message.text
  try {
    const resp = await fetch(config.get('services.tex2png.url'), {
      method: 'POST',
      body: amToTex(am),
    })
    switch (resp.status) {
      case 200:
        // @ts-ignore
        await ctx.replyWithPhoto({ source: resp.body })
        break
      case 400:
        const sender = ctx.message.from
        console.info(
          `Illegal input '${ctx.message.text}' from ${sender.id} (${sender.username})`,
        )
        await ctx.reply('Illegal input')
        break
      case 406:
        await ctx.reply('Rendering error')
        console.log(amToTex(am))
        break
      default:
        console.error(
          `Unexpected status code ${resp.status}: text ${await resp.text()}`,
        )
        await ctx.reply('Internal server error, contact with administrator')
    }
  } catch (e) {
    console.error(e)
    await ctx.reply('Internal server error, contact with administrator')
  }
})

bot.launch()
