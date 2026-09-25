import {prisma} from "../../lib/prisma.js"
import type { NextFunction, Request,Response } from "express";
import bcrypt, { genSalt } from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { success } from "zod";
import { error } from "node:console";

const register = async(req: Request,res : Response,next : NextFunction)=>{
    try{
        const {name,email,password} = req.body;
        
        //Check if user already exits
        const userExists = await prisma.user.findUnique({
            where:{
                email:email,
            }
        });

        if(userExists){
            return res.json({
                message: "User Already Exits"
            });
        }

        //Hashing Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        //Create User

        const user = await prisma.user.create({
            data:{
                name,
                email,
                password : hashedPassword
            },
        });

        const token = generateToken(user.id,res);

        if(user){
            return res.status(201).json({
                message : "User registered successfully",
                data:{
                    id : user.id,
                    name : name,
                    email : email
                },
                token
            });
        }

    }catch(error){
        next(error);
    }
};


const login = async(req:Request,res:Response,next:NextFunction) =>{
    try{
        const {email,password} = req.body;
        const userExits = await prisma.user.findUnique({
            where:{
                email : email
            }
        });

        if(!userExits){
            return res.status(401).json({
                message: "invalid user and password"
            })
        }

        const isPassword  = await bcrypt.compare(password,userExits.password);
        if(!isPassword){
            return res.status(401).json({
                message: "invalid user and password"
            })
        }

        //Generate JWT webtoken
        const token = generateToken(userExits.id,res);

        return res.status(201).json({
            message : "User registered successfully",
                data:{
                    id : userExits.id,
                    email : email
                },
                token
        });
    }catch(error){
        next(error);
    }
}

const logout = async(req:Request,res:Response,next: NextFunction)=>{
    try{
        res.cookie("jwt","",{
            httpOnly : true,
            expires : new Date(0)
        })

        return res.status(200).json({
            status : "Success",
            message : "Logged out successfully"
        })
    }catch(Error){
        next(error);
    }
}

export {register,login,logout};