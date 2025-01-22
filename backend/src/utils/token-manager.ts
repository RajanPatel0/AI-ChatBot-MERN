import { Response, Request,NextFunction } from 'express';

import jwt from 'jsonwebtoken';
import { resolve } from 'path';


export const createToken = (id: String , email: String , expiresIn)=>{
    const payload={id,email};
    const token=jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn,
    });
    return token;
};


export const verifyToken= async(req:Request, res:Response, next:NextFunction)=>{
    const token=req.signedCookies['${COOKIE_NAME}'];

    if(!token||token.trim()==""){
        return res.status(401).json({message:"Token Not Received"});
    }

    return new Promise<void>((resolve,reject)=>{
        return jwt.verify(token,process.env.JWT_SECRET, (err,success)=>{
            if(err){
                reject(err.message);
                return res.status(401).json({message:'Toekn Expired'})
            }else{
                resolve();
                res.locals.jwtData=success;
                return next();
            }
        })
    })
}