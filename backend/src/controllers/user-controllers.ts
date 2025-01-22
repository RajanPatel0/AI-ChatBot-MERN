import { NextFunction, Request, Response } from "express";
import User from "../models/User.js"
import { createToken } from "../utils/token-manager.js";
import {hash, compare} from "bcrypt";
import { COOKIE_NAME } from "../utils/constants.js";

export const getAllUsers=async (req:Request, res:Response, next:NextFunction)=>{
    try{
        //get all users:
        const users=await User.find();
        return res.status(200).json({message: "OK", users});
    }catch(error){
        console.log(error);
        return res.status(200).json({message: "ERROR", cause:error.message});
    }
}

export const userSignup=async (req:Request, res:Response, next:NextFunction)=>{
    try{
        //creating user signup this time:
        const {name, email, password}=req.body;
        const existingUser= await User.findOne({email});
        if(existingUser) return res.status(401).send("User Already Registered");
        const hashedPassword= await hash (password,10 );
        const user= new User({name, email, password:hashedPassword});
        await user.save();
        
        //create token & store cookie
        res.clearCookie(COOKIE_NAME,{
            httpOnly:true,
            domain: "localhost",
            signed: true,
            path: "/",
        });

        const token = createToken(user._id.toString(), user.email,"7d");
        //we want to use cookie so we'll use cookie parser which send cookie from back to frontend
        const expires= new Date();
        expires.setDate(expires.getDate()+7);
        res.cookie(COOKIE_NAME, token,{
            path: "/",
            domain: "localhost",
            expires,
            httpOnly: true,
            signed: true,
        });

        return res.status(201).json({message: "OK", name:user.name, eamil:user.email});
    }catch(error){
        console.log(error);
        return res.status(200).json({message: "ERROR", cause:error.message});
    }
}

export const userLogin=async (req:Request, res:Response, next:NextFunction)=>{
    try{
        //creating user login this time:
        const {email, password}=req.body;
        const user=await User.findOne({email});
        if(!user){
            return res.status(401).send("User Not registered");
        }

        const isPasswordCorrect= await compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(403).send("Incorrect Password");
        }

        res.clearCookie(COOKIE_NAME,{
            httpOnly:true,
            domain: "localhost",
            signed: true,
            path: "/",
        });

        const token = createToken(user._id.toString(), user.email,"7d");
        //we want to use cookie so we'll use cookie parser which send cookie from back to frontend
        const expires= new Date();
        expires.setDate(expires.getDate()+7);
        res.cookie(COOKIE_NAME, token,{
            path: "/",
            domain: "localhost",
            expires,
            httpOnly: true,
            signed: true,
        });
        //AFTER CHECKING BOTH UP data
        return res.status(201).json({message: "OK", name:user.name, eamil:user.email});
    }catch(error){
        console.log(error);
        return res.status(200).json({message: "ERROR", cause:error.message});
    }
}

export const verifyUser=async (req:Request, res:Response, next:NextFunction)=>{
    try{
        //verify if token is malfunctioned or not(user Token Check)
        const user=await User.findById({email:res.locals.jwtData.email});
        if(!user){
            return res.status(401).send("User Not registered OR Token malfunctioned");
        }
        console.log(user._id.toString(),res.locals.jwtData.id);

        if(user._id.toString()!==res.locals.jwtData.id){
            return res.status(401).send("Permissions didn't matched");
        }

        //AFTER CHECKING BOTH UP data
        return res.status(201).json({message: "OK", name:user.name, eamil:user.email});
    }catch(error){
        console.log(error);
        return res.status(200).json({message: "ERROR", cause:error.message});
    }
}