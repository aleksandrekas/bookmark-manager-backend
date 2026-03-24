import {  Router } from "express";
import { body,validationResult } from "express-validator";
import { generateToken,generateRefreshToken } from "../utilities/token.mjs";
import { database } from "../db.mjs";
import bcrypt from "bcrypt"
const loginRouter = Router()





loginRouter.post('/',
body('email')
.notEmpty().withMessage("email must not be empty").bail()
.isEmail().withMessage(),
body('password')
.notEmpty().withMessage('password is empty!').bail()
.isString().withMessage('password must be string'),
async (request,response)=>{
    const {email,password} = request.body;
    const resulterror = validationResult(request);
    const errors = [];
    const sql = 'select * from users where email = ?'


    if(!resulterror.isEmpty()){
        for(const i of resulterror.array()){
            errors.push(i.msg)
        }
        return response.send(errors);        
    }
    database.query(sql, [email],async (err, result) => {
        if (err) {
            return response.sendStatus(500); 
        }

        if (result.length === 0) {
            return response.status(404).send('user does not exist');
        }

        const passwordMatch = await bcrypt.compare(password,result[0].password)
        if(passwordMatch){
            const token = generateToken(result[0])
            const refreshToken = generateRefreshToken(result[0])
            try{
                response.cookie("refreshToken",refreshToken,{   
                    httpOnly:true,
                    secure:false,
                    sameSite:"lax",
                    maxAge: 7 * 24 * 60 * 60 * 1000
                })
            }catch(err){
                console.log(err)
            }
            return response.json({token})
        }
    });

    
})




export default loginRouter;