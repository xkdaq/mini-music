// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
const rp = require('request-promise')

cloud.init()

const BSE_URL = 'http://musicapi.xiecheng.live'

// 云函数入口函数
exports.main = async (event, context) => {

  const app = new TcbRouter({
    event
  })

  app.router('playlist', async (ctx, next) => {
    ctx.body = await cloud.database().collection('playlist')
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
      .then(res => {
        return res
      })
  })

  app.router('musiclist', async (ctx, next) => {
    ctx.body = await rp(BSE_URL + '/playlist/detail?id=' + parseInt(event.playlistId))
      .then(res => {
        return JSON.parse(res)
      })

  })

  app.router('musicUrl', async (ctx, next) => {
    ctx.body = await rp(BSE_URL + '/song/url?id=' + parseInt(event.musicId))
      .then(res => {
        return JSON.parse(res)
      })

  })


  app.router('lyric', async (ctx, next) => {
    ctx.body = await rp(BSE_URL + '/lyric/?id=' + parseInt(event.musicId))
      .then(res => {
        return res
      })

  })

  return app.serve()

}