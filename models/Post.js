import mongoose from "mongoose";

const schema = new mongoose.Schema({

    caption: String,

    image:{
        public_id:{
            type: String,
            required: true,
        },
        url:{
            type: String,
            required: true,
        }
    },

    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    },

    createsAt:{
        type: Date,
        default: Date.now,
    },

    likes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
    ],

    comments: [
        {
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref:"User",
            },

            comment:{
                type: String,
                // required: [true, "Comment cannot be empty"],
            },
        },
    ],
});

export const Post = mongoose.model("Post", schema);

