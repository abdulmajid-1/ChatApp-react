import { generateToken } from "../lib/utils.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs"

export const signup = async (req, res) =>  {
    const {fullname, password, email, bio} = req.body;
   try {
     if(!fullname || !password || !email, !bio){
         return res.json({success: false, message:"Missing parameters"});
     }
     const existedUser = User.findOne(email);
     if(existedUser){
         return res.json({success: false, message:"User Already exists"});
     }
 
     const salt = await bcrypt.genSalt(10);
     const hashedPassword = await bcrypt.hash(password, salt);
 
     const newUser = await User.create({
         fullname, email, password: hashedPassword, bio
     })

     const token = generateToken(newUser._id)

     res.json({success: true, userData: newUser, token, message:"Account created Successfully"})
   } catch (error) {
         res.json({success: false, message: error.message})

   }
}