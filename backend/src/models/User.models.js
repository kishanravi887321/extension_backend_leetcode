import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
 
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
        required:false,
    },
    googleId:{
        type:String,
        required:false,
    },
    picture:{
        type:String,
        required:false,
    }
  
});

UserSchema.pre("save", async function () {
    if (!this.password || !this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


UserSchema.methods.matchPassword = async function(enteredPassword){
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};


const User = mongoose.model("User", UserSchema);

export default User;