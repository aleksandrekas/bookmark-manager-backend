import { response, Router } from "express";
import { database } from "../db.mjs";

const archiveRoute = Router()


archiveRoute.patch('/',(request,response)=>{
    


    const bookmarkId = request.body.id
    database.query("update bookmarks set archived = 1 where id = ?",[bookmarkId],(error,result)=>{
        if(error){
            return response.json({message: error})
        }
        return response.send(true)
    })



})




export default archiveRoute