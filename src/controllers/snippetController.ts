import {prisma} from "../../lib/prisma.js";
import type { Request,Response } from "express";


const createSnippet = async(req:Request,res:Response)=>{
    try{
        const {title,content,language,isPublic} = req.body;

        if(!req.user){
            return res.status(401).json({
                message : "Unauthorized"
            })
        }

        const snippetData = await prisma.snippet.create({
            data:{
                title : title,
                content : content,
                language : language,
                isPublic : isPublic, 
                authorId : req.user?.id  
            }
        });

        if(snippetData){
            return res.status(201).json({
                message : "Snippet Created Successfully",
                snippet : snippetData
            });
        }

    }catch(error){
        console.log(error);
    }
}

const getSnippet = async(req:Request,res:Response)=>{
    try{
        if(!req.user){
            return res.status(401).json({
                message : "Unauthorized",
            });
        }

        const snippetData = await prisma.snippet.findMany({
            where:{
                OR : [
                        {
                        authorId : req.user?.id
                        },
                        {
                            isPublic : true
                        }
                    ]
                }
            });

        if(snippetData){
            return res.status(201).json({
                message : "Snippets Fetched Successfully",
                snippet : snippetData
            });
        }

    }catch(error){
        console.log(error);
    }
}

const getOneSnippet = async(req:Request,res:Response)=>{
    try{
        if(!req.user){
            return res.status(401).json({
                message : "Unauthorized"
            });
        }

        const snipId = Number(req.params.id);

        const oneSnippet = await prisma.snippet.findFirst({
            where:{
                id : snipId,
                OR : [
                    {
                        authorId : req.user?.id
                    },
                    {
                        isPublic : true
                    }
                ]
            },
        })
    }catch(error){
        console.log(error);
    }
}

const deleteSnippet = async(req : Request,res : Response)=>{
    try{

        const snipId = Number(req.params.id);
        if(!req.user){
            return res.status(401).json({
                message : "Unauthorized access"
            });
        }

        const snipData = await prisma.snippet.findFirst({
            where:{
                id: snipId,
                authorId : req.user?.id
            }
        });

        if(!snipData){
            return res.status(404).json({
                message : "No Snippets Found"
            });
        }

        await prisma.snippet.delete({
            where:{
                id : snipId
            }
        });

        return res.status(201).json({
            message : "Snippet Deleted successfully"
        });
    }
    catch(error){
        console.log(error);
    }
}

const updateSnippet = async(req:Request,res:Response)=>{
    try{

    }
    catch(error){
        console.log(error);
    }
}

export {createSnippet,getSnippet,getOneSnippet,deleteSnippet};