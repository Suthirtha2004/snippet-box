import { version } from "node:os";
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
        if(!req.user){
            return res.status(401).json({
                message : "User unauthorized",
            })
        }

        const snipId = Number(req.params.id);

        //Fetch the snippet
        const snipData = await prisma.snippet.findFirst({
            where:{
                id : snipId,
                authorId : req.user.id
            }
        })

        if(!snipData){
            return res.status(404).json({
                message : "Snippet not found"
            })
        }
        //Create a transaction - Updating the snippet version as well as creating a version

        const updatedSnip = await prisma.$transaction(async(tx)=>{

            //Save the old snippet as version
            await tx.snippetVersion.create({
                data:{
                    snippetId : snipData?.id,
                    title : snipData?.title,
                    content : snipData?.content,
                    language : snipData?.language,
                }
            });

            //Update the current snippet 
            const updated = await prisma.snippet.update({
                where:{
                    id : snipData.id
                },
                data : req.body
            });

            return updated;
        })

        if(updatedSnip){
            return res.status(201).json({
                message : "Snippet updated successfully",
                data : updatedSnip
            });
        }
    }
    catch(error){
        console.log(error);
    }
}

//Restore versions and get particular versions

const getSnippetVersion = async(req:Request,res:Response)=>{
    try{

        if(!req.user){
            return res.status(401).json({
                message : "User unauthorized"
            });
        }
        
        const verId = Number(req.params.versionId);
        const snipVersion = await prisma.snippetVersion.findFirst({
            where:{
                id : verId,
                snippet:{
                    authorId : req.user.id
                }
            }
        });

        if(snipVersion){
            return res.status(201).json({
                message : "Version fetched successfully",
                data : snipVersion
            })
        }

    }catch(error){
        console.log(error);
    }
}

const restoreSnippet = async(req:Request,res:Response)=>{
    try{
        if(!req.user)
            return res.status(401).json({
                message : "Unauthorized access"
        })

        const verId = Number(req.params.versionId);
        const snipId = Number(req.params.id);

        const snipVersion = await prisma.snippetVersion.findFirst({
            where :{
                id : verId,
                authorId : req.user.id
            }
        });

        const snipData = await prisma.snippet.findFirst({
            where:{
                id : snipId,
                authorId : req.user.id
            }
        });

        if(!snipData){
            return res.status(404).json({
                message : "Snippet not found"
            });
        }

        if(!snipVersion){
            return res.status(404).json({
                message : "Snippet Version not found"
            });
        }

        const restoreSnip = await prisma.$transaction(async(tx)=>{

            //Save the current version
            await tx.snippetVersion.create({
                data:{
                    snippetId : snipData.id,
                    title : snipData.title,
                    content : snipData.content,
                    language : snipData.language
                }
            });

            const restored = await tx.snippet.update({
                where :{
                    id : snipData.id
                },
                data:{
                    title : snipVersion.title,
                    content : snipVersion.content,
                    language : snipVersion.language
                }
            });

            return restored;
        });

        if(restoreSnip){
            return res.status(201).json({
                message : "Restored Snippet Version",
                data : restoreSnip
            });
        }

    }catch(error){
        console.log(error)
    }
}

export {createSnippet,getSnippet,getOneSnippet,deleteSnippet,updateSnippet,getSnippetVersion,restoreSnippet};