import type { Request,Response, NextFunction } from "express";
import type { ZodType } from "zod";


const validateRequest  = (schema : ZodType)=>{
    return (req:Request,res:Response,next:NextFunction)=>{

        const result = schema.safeParse(req.body);

        if(!result.success){
            const errorMessage = result.error.flatten();
            return res.status(400).json({
                message : "Validation failed",
                errors : errorMessage,
            });
        }

        req.body = result.data;
        next();
    }
}

export {validateRequest};