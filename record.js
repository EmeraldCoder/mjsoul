"use strict"
const fs = require("fs")
const https = require("https")
const pb = require("protobufjs")
const root = pb.Root.fromJSON(require("./liqi.json"))
const wrapper = root.lookupType("Wrapper")
const parse = (data)=>{
    try {
        let GameDetailRecords = root.lookupType("GameDetailRecords").decode(wrapper.decode(data).data)
        GameDetailRecords.actions.forEach((value, index) => {
            const data = wrapper.decode(value.result)

            if (data && data.name) {
                GameDetailRecords.actions[index].result = {
                    name: data.name.substr(4),
                    data: root.lookupType(data.name).decode(data.data)
                }
            }
        })
        return GameDetailRecords.actions
    } catch(e) {
        return {"error": "parse error"}
    }
}
const parseFile = (filepath)=>{
    return parse(fs.readFileSync(filepath))
}
const parseByUrl = (url, cb, option = {})=>{
    https.get(url, option, (res)=>{
        let raw = Buffer.from([])
        res.on("data", (data)=>{
            raw = Buffer.concat([raw, Buffer.from(data)])
        })
        res.on("end", ()=>{
            cb(parse(raw))
        })
    }).on("error", err=>{
        cb({"error": "connection error"})
    })
} 
const parseById = (id, cb, option = {})=>{
    let url = "https://record-v2.maj-soul.com:5333/majsoul/game_record/"+id
    parseByUrl(url, cb, option)
}
module.exports = {
    parse,
    parseFile,
    parseByUrl,
    parseById
}
