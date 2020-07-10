import { Contact, Message, Wechaty,log } from 'wechaty'
import { ScanStatus } from 'wechaty-puppet'
import { PuppetPadplus } from 'wechaty-puppet-padplus'
import {generate} from 'qrcode-terminal'
const iconv = require('iconv-lite')
//调用python子进程 同步调用
const exec = require('child_process').exec

const token = 'you_token'
const puppet = new PuppetPadplus({
  token,
})
const name  = 'pxj_bot'
const bot = new Wechaty({
  puppet,
  name, // generate xxxx.memory-card.json and save login data for the next login
})
function onScan (qrcode: string, status: ScanStatus) {
  if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
    generate(qrcode, { small: false })  // show qrcode on console

    log.info('StarterBot', 'onScan: %s(%s) - %s', ScanStatus[status], status)
  } else {
    log.info('StarterBot', 'onScan: %s(%s)', ScanStatus[status], status)
  }
}

function onLogin (user: Contact) {
  log.info('StarterBot', '%s login', user)
}

function onLogout (user: Contact) {
  log.info('StarterBot', '%s logout', user)
}

async function onMessage (msg: Message) {
  log.info('StarterBot', msg.toString())
  // console.log('msg.text',msg.text())
  exec('python match.py'+' '+msg.text(),{ encoding: 'binary'},function(error:any,stdout:string,stderr:any){
      if(error) {
          console.info('stderr : '+stderr)
      }
      var out:string=iconv.decode(Buffer.from(stdout, 'binary'),  'GBK')
      // var out= iconv.decode(Buffer.concat(stdout), 'utf8')
      // console.log('exec: ' + out);
      msg.say(out)
  })


}

bot.on('scan',    onScan)
bot.on('login',   onLogin)
bot.on('logout',  onLogout)
bot.on('message', onMessage)

bot.start()
  .then(() => log.info('StarterBot', 'Starter Bot Started.'))
  .catch(e => log.error('StarterBot', e))
