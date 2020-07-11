// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise');

const MAX_LIMIT = 10

cloud.init({
  env: 'xukee-test-9iprg'
})

const db = cloud.database()

const url = 'http://musicapi.xiecheng.live/personalized'

const playlistCollection = db.collection('playlist')

// 云函数入口函数
exports.main = async (event, context) => {

  //const list = await playlistCollection.get()

  const countResult = await playlistCollection.count()
  const total = countResult.total
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    let promise = playlistCollection.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  let list = {
    data: []
  }
  if (tasks.length > 0) {
    list = (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data)
      }
    })
  }

  const playList = await rp(url).then((res) => {
    return JSON.parse(res).result
  })

  //console.log(playList);
  //return playList

  const newData = []

  for (let i = 0, len1 = playList.length; i < len1; i++) {
    let flag = true
    for (let j = 0, len2 = list.data.length; j < len2; j++) {
      if (playList[i].id === list.data[j].id) {
        flag = false
        break
      }
    }
    if (flag) {
      newData.push(playList[i])
    }
  }

  for (let i = 0, len = newData.length; i < len; i++) {
    await playlistCollection.add({
      data: {
        ...newData[i],
        createTime: db.serverDate(),
      }
    }).then((res) => {
      console.log("保存数据成功!");
    }).catch((error) => {
      console.log(error);
    })
  }

  console.log(playList.length);

  console.log(list.data.length);

  return newData.length

}