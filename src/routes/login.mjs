    import {  Router } from "express";
    import { generateToken } from "../utilities/token.mjs";
    import { database } from "../db.mjs";
    import bcrypt from "bcrypt"
    const loginRouter = Router()





    loginRouter.post('/',async (request,response)=>{
        const {email,password} = request.body;
        const sql = 'select * from users where email = ?'
        if(!email){
            return response.json({error:"email was not provided"})
        }

        database.query(sql, [email],async (err, result) => {
            if (err) {
                return response.sendStatus(500); 
            }

            if (result.length === 0) {
                return response.status(404).json({error:"email error"});
            }

            const passwordMatch = await bcrypt.compare(password,result[0].password)

            if(passwordMatch){
                const token = generateToken(result[0])
                return response.json({token,user:result[0]})
            }else{
                return response.status(401).json({error:"wrong password"})
            }
        });

        
    })




    export default loginRouter;