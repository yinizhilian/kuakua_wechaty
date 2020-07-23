import { Contact, Message, Wechaty,log, Room } from 'wechaty'
import { ScanStatus } from 'wechaty-puppet'
import { PuppetPadplus } from 'wechaty-puppet-padplus'
import {generate} from 'qrcode-terminal'

//后面需要加载到配置文件实现记录的载入
let bot_online_config={
  'bot_switch':'1'//是否要调用机器人
}
/*
  依赖的引入
*/
//天气获取
let weather=require('./weather.ts')
//消息处理
let MsgProc=require('./MsgProc.ts')
const iconv = require('iconv-lite')
//调用python子进程 同步调用
const exec = require('child_process').exec
//调用定时模块
const schedule=require('node-schedule')

/*
  bot初始化
*/
const token = 'puppet_padplus_e35c4ddaed71d7b3'
const puppet = new PuppetPadplus({
  token,
})
const name  = 'pxj_bot'
const bot = new Wechaty({
  puppet,
  name, // generate xxxx.memory-card.json and save login data for the next login
})

/*
  bot微信相关函数初始化（扫描二维码、登陆、登出）
*/
//扫描二维码
function onScan (qrcode: string, status: ScanStatus) {
  if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
    generate(qrcode, { small: false })  // show qrcode on console

    log.info('StarterBot', 'onScan: %s(%s) - %s', ScanStatus[status], status)
  } else {
    log.info('StarterBot', 'onScan: %s(%s)', ScanStatus[status], status)
  }
}
//登陆
function onLogin (user: Contact) {
  log.info('StarterBot', '%s login', user)

}
//登出
function onLogout (user: Contact) {
  log.info('StarterBot', '%s logout', user)
}

/*
  bot微信相关操作处理（消息接收，）
*/
//微信消息接收处理
async function onMessage (msg: Message) {
  console.log(msg)
  MsgProc.msg_receive_proc(msg,bot_online_config)
  MsgProc.room_msg_proc();
}

<<<<<<< HEAD
async function onRoomjoin (room: Room,inviteeList:Contact[],inviter:Contact) {
  console.log('--------------打印room信息------------------------')
  console.log(room)
  console.log('inviteeList',inviteeList)
  console.log('inviter',inviter)
  let lengthx=inviteeList.length
  console.log('inviteeList length',lengthx)
  const nameList=inviteeList.map((c:any)=>c.payload.name).join('，')
  const roomtopic=await room.topic()
  console.log(`Room got new member ${nameList}, invited by ${inviter}`)
  room.say(`👏👏热烈欢迎 ${nameList} 加入${roomtopic} 🎊🎊🎊~`)
}
  // room.o
  // room.on('join',(room,inviteeList:any,inviter:any) =>{
  //   console.log('开始执行room on中的内容')
  //   let nameList:any=[]
  //   console.log('inviteeList',inviteeList)
  //   console.log('inviter',inviter)
  //   let lengthx=inviteeList.lengthx
  //   console.log('inviteeList length',lengthx)
  //   for(let index=0;index<length;index++){
  //     console.log(inviteeList[index].name)
  //     nameList.push(inviteeList[index].name) 
  //   }

  //   // const nameList=inviteeList.map((c:any)=>c.name).join(',')
  //   console.log(`Room got new member ${nameList}, invited by ${inviter}`)
  // }
  // )
=======
>>>>>>> 021e52506cc37845deda9465fe83a12ece9b5c96

  // console.log('room_msg_proc')
  // const room = await bot_for_msg.Room.find({id:tmp}) 
  // console.log(room)
  // if(room){
  //     room.on('join',(room:any,inviteeList:any,inviter:any)=>{
  //         const nameList = inviteeList.map((c:any) => c.name()).join(',')
  //         console.log(`Room got new member ${nameList}, invited by ${inviter}`)
  //     })
  // }

<<<<<<< HEAD

  // MsgProc.msg_receive_proc(msg,bot_online_config)
  // MsgProc.room_msg_proc();
// }


=======
>>>>>>> 021e52506cc37845deda9465fe83a12ece9b5c96
bot.on('scan',    onScan)
bot.on('login',   onLogin)
bot.on('logout',  onLogout)
bot.on('message', onMessage)
bot.on('room-join', onRoomjoin)

async function main(){
  await bot.start()
  .then(() => log.info('StarterBot', 'Starter Bot Started.'))
  .catch(e => log.error('StarterBot', e))
<<<<<<< HEAD
  
  //自动定时消息发送启动
  MsgProc.sendbot(bot) //将bot传给消息处理。
  schedule.scheduleJob('0 0 8 * * *', MsgProc.sendDaily)
  schedule.scheduleJob('0 30 8 * * *', MsgProc.sendDailyGm)//早安定时早晨8：30

}

main();
=======
>>>>>>> 021e52506cc37845deda9465fe83a12ece9b5c96
