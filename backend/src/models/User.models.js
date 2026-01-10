import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const QustSchema = new mongoose.Schema({
 
    username:{
        type:String,
        required:true,
        unique:true,
    },
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    }
  
});

const Qust = mongoose.model("Qust", QustSchema);