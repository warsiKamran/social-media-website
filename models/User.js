import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const schema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: [true, "Email already exists"],
        validate: validator.isEmail,
    },

    password: {
        type: String,
        required: [true, "Please enter your password"],
        minlength: [6, "Password must be of 6 characters"],
        select: false,
    },

    avatar:{
        public_id:{
            type: String,
            required: true
        },
        url:{
            type: String,
            required: true
        },
    },

    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Post",
        },
    ],

    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
    ],

    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
    ],

    resetPasswordToken: String,
    resetPasswordExpire: Date,
});


schema.pre("save", async function(next){

    if(!this.isModified("password")){
        return next();
    }

    this.password = await bcrypt.hash(this.password,10);
    next();
});

schema.methods.comparePassword = async function(password){

    return await bcrypt.compare(password, this.password);
};

schema.methods.getJWTtoken = function(){

    return jwt.sign({_id:this._id}, process.env.JWT_SECRET, {
        expiresIn: "15d",
    });
};

schema.methods.getResetToken = function(){

    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 10 * 60  * 1000;

    return resetToken;
};

export const User = mongoose.model("User", schema);

