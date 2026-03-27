import { Router } from "express";
import jwt  from "jsonwebtoken";
import { database } from "../db.mjs";
import { body,validationResult } from "express-validator";

const editBookmarkRouter = Router()


editBookmarkRouter.patch("/",
    body('title').notEmpty().withMessage('title is empty').bail().isString().withMessage('title shoud be string'),
    body('url').notEmpty().withMessage('url is empty').bail(),
    body('description').notEmpty().withMessage('description is empty').bail().isString().withMessage('description should be string'),
    body('selectedtags').notEmpty().withMessage('tags are empty').bail().isArray().withMessage('shoud be array of tags'),    
    (request,response)=>{
    const bodyErrors = validationResult(request)
    const errors = []





    const bookmarkQuery = 'update bookmarks set title = ?, url = ?, description = ? where id = ?'
    const deleteTagQuery = 'delete from bookmark_tag where bookmark_id = ?'
    const tagquery = `insert into bookmark_tag(bookmark_id,tag_id) values ?`


    if(!bodyErrors.isEmpty()){
        console.log("its empty!")
        for(const i of bodyErrors.array()){
            errors.push(i.msg)
        }
        return response.send(errors)
    }

    const {title,url,description,selectedtags,id} = request.body
    const token = request.headers.authorization.split(" ")[1]
    const decoded = jwt.verify(token,process.env.JWT_SECRET)    
    function getTagIds(){
        return new Promise((resolve, reject) => {
            database.query("select id from tags where name in (?)",[selectedtags],(err,res)=>{
                if(err){
                    reject(err)
                    return
                }

                const ids = res.map((item)=> item)
                resolve(ids)
            })
        })
    }

    if(decoded.name === "TokenExpiredError"){
        return response.status(401).json({error:"token expired"})
    }
    
    database.query(bookmarkQuery,[title,url,description,id],async (error,result)=>{
        if(error){
            return response.json({message:error})
        }
        
        database.query(deleteTagQuery,[id],(err,res)=>{
            if(err){
                return response.json({message:error})
            }   
        })
        if(selectedtags.length > 0){
            const bookmarkId = id;
            const tagIds = await getTagIds()
            const junctionTableValues = tagIds.map((item)=>[bookmarkId,item.id])
    
    
    
            database.query(tagquery,[junctionTableValues],(err,res)=>{
                if(err){
                    return response.json({message:err})
                }
                if(res){
                    return response.status(201).json({message:"edited"})
                }
            })
        }
    })
})





export default editBookmarkRouter