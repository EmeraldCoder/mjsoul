"use strict"
const MJSoul = require("./mjsoul")
const { parse } = require('./record')

const mjsoul = new MJSoul()

mjsoul.open(async () => {
    try {
        await mjsoul.sendAsync(
            "login",
            {account: "account", password: mjsoul.hash("password")}
        )
    
        const fetchGameRecordResponse = await mjsoul.sendAsync('fetchGameRecord', { game_uuid: '200903-4457b2ba-642a-401c-9435-b4ae86b9c72b' }) // old version of game record
        // const fetchGameRecordResponse = await mjsoul.sendAsync('fetchGameRecord', { game_uuid: '211026-9d1c4857-d1a5-4880-8872-68d5ae5e5a85' }) // new version of game record
        const gameRecord = { head: fetchGameRecordResponse.head, data: parse(fetchGameRecordResponse.data) }
    
        console.log(gameRecord)
    
        mjsoul.close()
    } catch (e) {
        console.log(e)
        mjsoul.close()
    }
})
