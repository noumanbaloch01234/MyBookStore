import User from "../Model/User.model.js"
import bcryptjs from "bcryptjs"

export const signup = async(req,res)=>{
    try{
        const{fullname ,email,password}=req.body;
        const user=await User.findOne({email});
        if(user){
            return res.status(400).json({message:"user already exist"});
        }
        const hashpassword = await bcryptjs.hash(password,10);
        const createUser= new User ({
            fullname: fullname,
            email: email,
            password: hashpassword
        })
        await createUser.save();
        res.status(201).json({message:"user created successfully",user:{
            _id:createUser._id,
            fullname:createUser.fullname,
            password:createUser.password,
        }})

    }catch(error){
        res.status(500).json({message:"internal server error"})

    }
}

export const login = async (req,res)=>{
    try{
        const{email,password}=req.body;
        const user=await User.findOne({email});
        const isMatch=await bcryptjs.compare(password, user.password);
        if (!user || !isMatch){
            return res.status(400).json({message:"invalid credential"});
        }else{
            return res.status(200).json({message :"login succcessfull",user:{
                _id:user.id,
                fullname:user.fullname,
                email:user.email
            }
        })
        }


    }catch(error){
                res.status(500).json({message:"internal server error"})

    }
}