import { Router } from "express";
import { database } from "../db.mjs";
import jwt from "jsonwebtoken";


const editRouter = Router()


editRouter.patch('/',(request,response)=>{
    if(Object.keys(request.body).length === 0) return response.json({message:"body is empty"});
    const token = request.headers.authorization.split(" ")[1]
    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    
    if(decoded.name === "TokenExpiredError"){
        return response.status(401).json({error:"token expired"})
    }


    const { id, ...fields } = request.body



    const keys = Object.keys(fields)
    const values = Object.values(fields)

    const args = keys.map(key => `${key} = ?`).join(', ');
    const editQuery = `update bookmarks set ${args} where id = ?`



    database.query(editQuery,[...values,id],(error,result)=>{
        if(error){
            return response.json({error:error})
        }

        return response.json({results:result})
    })

})







export default editRouter