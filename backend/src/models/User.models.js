import mongoose from "mongoose";

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