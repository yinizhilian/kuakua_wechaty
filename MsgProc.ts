import { Message ,log,Wechaty} from 'wechaty'
const schedule=require('node-schedule')
//人员信息管理
const contater_arr=["Contact<下雨天bot>","Contact<今天bot>","Contact<PPbot>"]
//群组信息管理
const chatroom_arr=["6935712742@chatroom","24513956973@chatroom","7850799535@chatroom"]   //6935712742@chatroom[夸夸群]
//自动发送人员管理
const dailySend_user_arr=["下雨天bot","PPbot","今天bot"]//天气、"今天bot",,"PPbot"
//自动发送群管理
const dailySend_room_arr=["24513956973@chatroom","6935712742@chatroom","7850799535@chatroom"]//早安问候、

let bot_for_msg=new Wechaty()

let myUtil=require('./myUtil.ts')
let weather=require('./weather.ts')
const exec = require('child_process').exec
const iconv = require('iconv-lite')//防止控制台上打印的数据编码不正确
const fs=require('fs')
var underscore = require('underscore');
//一开始的消息处理函数
function msg_receive_proc(msg:any,bot_online_config:any){
    //判断消息是否是三分钟前的消息
    if (msg.age() > 180) return;
    log.info('StarterBot', msg.toString())
    var contactor = msg.from()
    console.log(msg)
    //消息开关---是否启动机器人
    if(msg.text()=='召唤PP'){
        bot_online_config['bot_switch']=1
        msg.say("主人，我来啦，今天让我夸谁呢？😉")
        return ;
    }else if(msg.text()=='PP退下'){
        bot_online_config['bot_switch']=0
        msg.say("好的主人~☺")
        return;
    }
    //判断消息是出自哪里---消息处理
    if((bot_online_config['bot_switch']==1)&&(contater_arr.indexOf(String(contactor))>-1 || chatroom_arr.indexOf(msg.room()?.id)>-1)){
      exec('python match.py'+' '+msg.text(),{ encoding: 'binary'},function(error:any,stdout:string,stderr:any){
        if(error) {
            console.info('stderr : '+stderr)
        }
        var out:string=iconv.decode(Buffer.from(stdout, 'binary'),  'GBK')
        msg.say(out)
        })

    }
}

/*
    消息定时发送
*/
//天气自动发送
async function sendDaily() {
    //单用户发送
    console.log('————————————————天气发送————————————————')
    
    for(let tmp of dailySend_user_arr){
        const contact = await bot_for_msg.Contact.find({alias:tmp})
        let city=contact?.city()
        let province=contact?.province()
        console.log(city)
        console.log(province)
        let weather_send=await getweather(city,province)
        console.log('完成天气获取~')
        if(weather_send=='not-in-china'){return } 
        contact?.say(weather_send)

        // console.log(contact?.tags()) 
        // console.log(contact?.province())
    }
    //群组发送
    // for(let tmp of dailySend_room_arr){
    //     const room = await bot.Room.find({id:tmp}) 
    //     room?.say('room hello')
    // }
}

//早安问候语
async function sendDailyGm() {
    console.log('————————————————早安问候语————————————————')
    let wuhou_data=fs.readFileSync('.\\data\\wenhou_corpus.json','utf-8')
    // console.log(wuhou_data)
    let wenhou_json=JSON.parse(wuhou_data)
    let random_index
    let text_send
    do{
        random_index=Math.ceil(Math.random()*395)
        text_send=wenhou_json['corpus'][1]['GoodMorning'][random_index][random_index.toString()]
        if(text_send!='--pengxj---'){
            break
        }
    }while(1)
    wenhou_json['corpus'][1]['GoodMorning'][random_index][random_index.toString()]='--pengxj---'
    let modify_json=JSON.stringify(wenhou_json)
    fs.writeFileSync('.\\data\\wenhou_corpus.json',modify_json)
   // 群组发送
    for(let tmp of dailySend_room_arr){
        const room = await bot_for_msg.Room.find({id:tmp}) 
        room?.say(text_send)
    }

}





async function sendbot(bot:any) {
    bot_for_msg=bot
}

/*
获取天气
*/
async function getweather(city:any,province:any){
    if(province=='Shanghai'){
        city='Shanghai'
    }
    let city_chinese=await myUtil.getChina(city)
    console.log('city_chinese',city_chinese)
    if(city_chinese=='not-in-china'){
        return 'not-in-china'
    }
    let weather_json=await weather.findweather(city_chinese)
    let temp=JSON.parse(weather_json)
    let result='今日天气：\n'+temp['city']+'\n'+temp['weather']+'\n'+temp['temperature']+'\n'+temp['wind']+'\n'+temp['aqi']+'\n'+temp['tip']
    // temp='今日天气：\n'+'🏙'+city+'\n'+'天气：'+temp['weather']+'\n'+
    console.log('get weather end~')
    return result
}

/*
    群管理，
    1、检测加群消息
*/
async function room_msg_proc(){

}


exports.room_msg_proc=room_msg_proc
exports.sendbot=sendbot
exports.sendDaily=sendDaily
exports.sendDailyGm=sendDailyGm
exports.msg_receive_proc=msg_receive_proc
