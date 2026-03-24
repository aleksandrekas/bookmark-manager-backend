import { Router } from "express";
import jwt from "jsonwebtoken";
import { database } from "../db.mjs";


const getBookmarks = Router()



getBookmarks.get("/",(request,response)=>{
    const tokenString  = request.headers.authorization;
    const token = tokenString.split(" ")[1]
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const userquery = `select * from users where id = ?` 
        const bookmarkquery = `select 
        b.id,
        b.title,
        b.url,
        b.description,
        b.archived,
        b.created,
        b.visitCount,
        b.lastVisit,
        b.userId, 
        json_arrayagg(t.name) as tags 
        from bookmarks b 
        left join bookmark_tag bt on b.id = bt.bookmark_id
        left join tags t on bt.tag_id = t.id
        where b.userId = ?
        group by b.id`

        
        database.query(userquery,[decoded.id],(error,result)=>{
            if(error){
               return response.status(500).json({message:"database query error at user"})
            }
            const {id,name,email} = result[0]
            database.query(bookmarkquery,[id],(err,res)=>{
                
                if(err){
                    return response.status(500).json({message:"database query error at bookmarks"})
                }
                response.json({
                    userId:id,
                    userName:name,
                    userEmail:email,
                    res
                })
            })

        })
    }catch(err){
        if(err.name === 'TokenExpiredError'){
            return response.status(401).json("token expired")
        }else{
            return response.status(401).json("invalid token")   
        }
    }
})

export default getBookmarks;