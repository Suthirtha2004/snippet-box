//Generate token helper files
import "dotenv/config";
import  jwt  from "jsonwebtoken";
import type { Request,Response } from "express";


const generateToken = (userId : number,res :Response)=>{
    const payload = {
        id : userId
    };  

    const secret = process.env.JWT_SECRET;
    if(!secret){
        throw new Error("Secret not defined")
    };

    const token = jwt.sign(payload,secret ,{
        expiresIn : "7d"
    });

    //Setting up http-only cookie
    res.cookie("jwt",token,{
        httpOnly : true,
        secure : process.env.NODE_ENV === "production",
        sameSite : "strict",
        maxAge : (1000 * 60 * 60 * 24) * 7
    })
    return token;
}

export {generateToken};
