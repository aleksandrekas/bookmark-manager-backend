import { Router } from "express";
import { body ,validationResult} from "express-validator";
import { database } from "../db.mjs";
import jwt from "jsonwebtoken";


const addBookmarkRouter = Router()




addBookmarkRouter.post("/",
    body('title').notEmpty().withMessage('title is empty').bail().isString().withMessage('title shoud be string'),
    body('url').notEmpty().withMessage('url is empty').bail(),
    body('description').notEmpty().withMessage('description is empty').bail().isString().withMessage('description should be string'),
    body('selectedtags').notEmpty().withMessage('tags are empty').bail().isArray().withMessage('shoud be array of tags'),
    body('archived').notEmpty().withMessage("archived must not be empty").isBoolean().withMessage("archived must be either true or false"),
(request,response)=>{
    const bodyErrors = validationResult(request)
    const errors = []

    if(!bodyErrors.isEmpty()){
        console.log("its empty!")
        for(const i of bodyErrors.array()){
            errors.push(i.msg)
        }
        return response.send(errors)
    }
    const {title,url,description,selectedtags,archived,created,visitCount,lastVisit,pinned} = request.body
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
    





    const bookmarkquery = `insert into bookmarks(title,url,description,userId,archived,created,visitCount,lastVisit,pinned) values(?,?,?,?,?,?,?,?,?)`
    const tagquery = `insert into bookmark_tag(bookmark_id,tag_id) values ?`




    database.query(bookmarkquery,[title,url,description,decoded.id,archived,created,visitCount,lastVisit,pinned],async (error,result)=>{
        if(error){
            console.log(error)
            return response.json({message:"database error"})
        }
        if(result){
            const bookmarkId = result.insertId;
            const tagIds = await getTagIds()
            const junctionTableValues = tagIds.map((item)=>[bookmarkId,item.id])
            console.log(junctionTableValues)
            database.query(tagquery,[junctionTableValues],(err,res)=>{
                if(err){
                    return response.json({message:err})
                }
                if(res){
                    return response.status(201).json({message:"created"})
                }
            })
        }
    })



})







export default addBookmarkRouter