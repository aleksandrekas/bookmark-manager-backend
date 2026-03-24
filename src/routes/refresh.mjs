import {Router } from "express";
import jwt from "jsonwebtoken";
import { database } from "../db.mjs";
import { generateToken } from "../utilities/token.mjs";

const refreshRouter = Router();


refreshRouter.post(
  '/',
  (request, response) => {
    if(!request.cookies.refreshToken) return response.status(401).json({message:"refresh token is missing"})
    const refreshToken = jwt.verify(request.cookies.refreshToken,process.env.REF_SECRET)
    if(refreshToken.name === "TokenExpiredError"){
      return response.status(401).json("refreshtoken expired")
    }
    const newToken = generateToken(refreshToken)
    response.json({newToken:newToken,message:"refreshed"})
  }
);




export default refreshRouter;