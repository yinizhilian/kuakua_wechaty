/**
 * 通过请求访问天气接口，并返回最近七天的结果,另外还有空气质量接口
🍃 风
🏙城市
🌍 空气质量
☘ tips
 * */
const weather_dict={'yin':'☁','yun':'🌥','yu':'🌧','bingbao':'🌧',
                  'lei':'🌩','qing':'☀','wu':'🌫','xue':'🌨','shachen':'🌪'}
const MyAPIKEY:string='bd04f1478caed3b600e29ffbd0a71a5a'
var request=require('request')
var request1=require('request')
var async = require('async');
var underscore = require('underscore');

const a=async function(request_url_weather:any){
        return new Promise((resolve,reject)=>{
            request.get(request_url_weather,function(err:any,response:any,body:any){
                // console.log('a:',body)
                if (err) {
                    reject(err);
                } else{
                    resolve(body);
                }
            }
        )}
        )
    };

 const b=async function(request_url_kongqi:any){
    return new Promise((resolve,reject)=>{
        request.get(request_url_kongqi,function(err:any,response:any,body:any){
            // console.log('a:',body)
            // let json_date=JSON.parse(body) 
            if (err) {
                reject(err);
            } else{
                resolve(body);
            }
        }
    )}
    )
};

async  function  weatherAsync(weatherCity:any){
    let result={
        'city':'',
        'temperature':'',
        'weather':'',
        'wind':'',
        'aqi':'',
        'tip':''
    }  
    let request_url_weather:string = encodeURI('http://api.tianapi.com/txapi/tianqi/index?key='+MyAPIKEY+'&city='+weatherCity)
    let request_url_kongqi:string = encodeURI('http://api.tianapi.com/txapi/aqi/index?key='+MyAPIKEY+'&area='+weatherCity)
    let result1=await a(request_url_weather)
    let result2=await b(request_url_kongqi)
    let result1_json=JSON.parse(String(result1))
    let result2_json=JSON.parse(String(result2))
    //城市
    result['city']='🏙'+weatherCity
    //天气
    let weatherimg:string=result1_json['newslist'][0]['weatherimg']
    let tmp=weatherimg.split('.')
    let emoji=underscore.values(underscore.pick(weather_dict,tmp[0]))[0]
    result['weather']='天气：'+result1_json['newslist'][0]['weather']+emoji
    //温度
    result['temperature']='温度：'+result1_json['newslist'][0]['lowest']+'-'+result1_json['newslist'][0]['highest']
    //风
    result['wind']='风速：'+result1_json['newslist'][0]['wind']+' '+result1_json['newslist'][0]['windsc']
    //PM2.5
    result['aqi']='AQI：'+result2_json['newslist'][0]['quality']+'('+result2_json['newslist'][0]['aqi']+')'
    //Tip
    result['tip']='Tip：'+result1_json['newslist'][0]['tips']
    
    let result_json=JSON.stringify(result)
    console.log('完成findweather~')
    return result_json
}

exports.findweather=weatherAsync



// let json_date=JSON.parse(response) 
// let weather_area=json_date['newslist'][1]['area']
// let today_date=json_date['newslist'][1]['date']+'  '+json_date['newslist'][1]['week']
// let today_wind=json_date['newslist'][1]['wind']+'  '+json_date['newslist'][1]['windsc']
// let today_weather=json_date['newslist'][1]['weather']
// console.log('weather_area:',String(weather_area))
// console.log('today_wind:',String(today_wind))



// async.series([
//     function(){
//         request.get(request_url_weather,
//             function(err:any,response:any,body:any){
//                 console.log('a:',body)
//                 // let json_date=JSON.parse(body) 
//             }
//         )
//     },
//     function(){
//         request.get(request_url_kongqi,
//             function(err:any,response:any,body:any){
//                 console.log(err)
//                 console.log('b:',body)
//                 // let json_date=JSON.parse(body) 
//             }
//         )
//     }],function(err:any,response:any,body:any){
//     console.log('ERROR:',err)
//     console.log('body:',body)
//     });



// let a=function(callback:any){
//     request.get(request_url_weather,
//         function(err:any,response:any,body:any){
//             console.log('a:',body)
//             // let json_date=JSON.parse(body) 
//         }
//     )
//     callback(null, "function a");
// };
// let b=function(callback:any){
//     request.get(request_url_kongqi,
//         function(err:any,response:any,body:any){
//             console.log(err)
//             console.log('b:',body)
//             // let json_date=JSON.parse(body) 
//         }
//     )
//     callback(null, "function b");
// };
// async.series([a,b],function(err:any,result:any){
//     console.log('ERROR:',err)
//     console.log('result:',result)

// });

// let json_date=JSON.parse(response) 
// let weather_area=json_date['newslist'][1]['area']
// let today_date=json_date['newslist'][1]['date']+'  '+json_date['newslist'][1]['week']
// let today_wind=json_date['newslist'][1]['wind']+'  '+json_date['newslist'][1]['windsc']
// let today_weather=json_date['newslist'][1]['weather']
// console.log('weather_area:',String(weather_area))
// console.log('today_wind:',String(today_wind))



// httpsync.get(request_url_weather,function(err:any,respose:any,body:any){
//             if(err){
//                 console.log('ERROR:'+err)
//             }
//         json_date=JSON.parse(body)
//         console.log(json_date['newslist'][1]['area']) 
//     // today_date=json_date['newslist'][1]['date']+'  '+json_date['newslist'][1]['week']
//     // today_wind=json_date['newslist'][1]['wind']+'  '+json_date['newslist'][1]['windsc']
//     // today_weather=json_date['newslist'][1]['weather']
//          }
//         )
    
// }
// let fn=async function(){
//     await resulet('上海')
//     let weather_area=json_date['newslist'][1]['area']
//     let today_date=json_date['newslist'][1]['date']+'  '+json_date['newslist'][1]['week']
//     let today_wind=json_date['newslist'][1]['wind']+'  '+json_date['newslist'][1]['windsc']
//     let today_weather=json_date['newslist'][1]['weather']
//     console.log('weather_area:',String(weather_area))
//     console.log('today_wind:',String(today_wind))
// }
