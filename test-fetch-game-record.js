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
    
        const fetchGameRecordResponse = await mjsoul.sendAsync('fetchGameRecord', { game_uuid: 'game_uuid' })
        const gameRecord = { head: fetchGameRecordResponse.head, data: parse(fetchGameRecordResponse.data) }
    
        console.log(gameRecord)
    
        mjsoul.close()
    } catch (e) {
        console.log(e)
        mjsoul.close()
    }
})
