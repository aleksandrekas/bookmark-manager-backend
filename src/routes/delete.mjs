import { Router } from "express";
import { database } from "../db.mjs";
import jwt from "jsonwebtoken";



const deleteRouter = Router()

deleteRouter.delete('/',(request,response)=>{
    const bookmarkId = request.body.id
    if(!bookmarkId){
        return response.json({message:"id was not provided"})
    }
    const token = request.headers.authorization.split(" ")[1]
    const decoded = jwt.verify(token,process.env.JWT_SECRET)    
    if(decoded.name === "TokenExpiredError"){
        return response.status(401).json({error:"token expired"})
    }
    const tagQuery = "delete from bookmark_tag where bookmark_id = ?"
    const bookmarkQuery = "delete from bookmarks where id = ?"

    database.query(tagQuery,[bookmarkId],(error,result)=>{
        if(error){
            return response.json({error:error})
        }
        database.query(bookmarkQuery,[bookmarkId],(error,resul)=>{
            if(error){
                return response.json({error:error})
            }
            return response.json({
                message:"deleted"
            })
        })
    })

})




export default deleteRouter