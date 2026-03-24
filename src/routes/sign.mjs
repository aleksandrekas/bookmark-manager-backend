import { Router } from "express";
import { body,validationResult } from "express-validator";
import bcrypt from "bcrypt";
import {database} from "../db.mjs"
const signRouter = Router();
 


signRouter.post('/',
    body('name')
    .notEmpty().withMessage("name shoud not be empty")
    .isString().withMessage("name shoud be string"),
    body('email')
    .notEmpty().withMessage("email shoud not be empty")
    .isEmail().withMessage("string shoud be email"),
    body('password')
    .notEmpty().withMessage("password shoud not be empty")
    .isString().withMessage('password must be string'),
    async (request,response)=>{
    const valResult = validationResult(request);
    const {name,email,password} = request.body;
    const errors = []

    const sql = `
        INSERT INTO users (name, email, password)
        VALUES (?, ?, ?)
    `;

    
    if(!valResult.isEmpty()){
        for(const i of valResult.array()){
            errors.push(i.msg)
        }
        return response.send(errors);
    }
    const hashedPassword = await bcrypt.hash(password,13);
    database.query(sql,[name,email,hashedPassword],(err)=>{
        if(err){
            return response.status(500).send(err)
        }
        response.sendStatus(201)
    })
})



export default signRouter