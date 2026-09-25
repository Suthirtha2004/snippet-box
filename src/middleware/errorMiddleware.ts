import type { Request, Response, NextFunction } from "express";


const errorMiddleware = (err: Error,req:Request,res:Response , next : NextFunction) =>{
        console.log(err);

        return res.status(500).json({
            message : "Internal Server Error"
        });
}

export default errorMiddleware;