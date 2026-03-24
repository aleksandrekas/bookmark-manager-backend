import jwt from "jsonwebtoken";
import crypto from 'crypto';

export function generateToken(user){
    if (!process.env.JWT_SECRET) {
        throw new Error("secret is not defined");
    }


    return jwt.sign({
            id:user.id,
            name:user.name,
            email:user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn:"30m"
        }
    )
}


export function generateRefreshToken(user){
    if(!process.env.REF_SECRET){
        throw new Error('secret is not defined')
    }
    return jwt.sign({
            id:user.id,
            name:user.name,
            email:user.email,
            tokenId:crypto.randomUUID()
        },
        process.env.REF_SECRET,
        {
            expiresIn:"2d"
        }
    )
}



export function authennticateToken(request,response,next){
    const header = request.headers['authorization'];
    const token = header ? header.split(' ')[1] : null;
    if(token === null) return response.sendStatus(403)
    
    jwt.verify(token ,process.env.JWT_SECRET,(error,user)=>{
        if(error){
            response.sendStatus(403)
            return
        }else{
            request.user = user
            next()
        }
    })
}