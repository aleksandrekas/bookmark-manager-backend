import {  Router } from "express";
import { database } from "../db.mjs";
const example = Router()



example.post('/',(request,response)=>{
    const tags = request.body.selectedtags
    console.log(tags)

    const tagId =async ()=>{
        await database.query("select id from tags where name in (?)",[tags],(errors,result)=>{
            if(errors){
                return response.status(401).json({message:"database error"})
            }
            const tagId = result.map((item)=>[item.id])
            return tagId
        })
    }


    const tag = tagId()
    console.log(tag)
    response.json({tag})

})





export default example