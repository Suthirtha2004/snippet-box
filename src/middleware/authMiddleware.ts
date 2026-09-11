import jwt from "jsonwebtoken";
import type { Request, Response ,NextFunction } from "express";
import {prisma} from "../../lib/prisma.js";
import "dotenv/config";

const authMiddleware = async(req:Request,res:Response,next : NextFunction)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1];
    }else if(req.cookies.jwt){
        token = req.cookies.jwt;
    }

    if(!token){
        return res.status(401).json({
            message : "No token , no authorization"
        })
    }
    try{
        const secret = process.env.JWT_SECRET;
        if(!secret){
            throw new Error("Secret not defined");
        }
        const decoded = jwt.verify(token,secret) as jwt.JwtPayload & {
            id : number
        };
        const user = await prisma.user.findUnique({
            where:{
                id : decoded.id
            },
        });

        if(!user){
            return res.status(404).json({
                message : "User not exists"
            })
        }

        req.user = user;
        next();

    }catch(error){
        console.log(error);
    }
}

export default authMiddleware;