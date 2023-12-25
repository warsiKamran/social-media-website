import {Post} from "../models/Post.js";
import { User } from "../models/User.js";


// upload a post
export const upload = async(req,res) => {

    try{

        const {caption} = req.body;

        const newPostData = {

            caption,
            image: {
                public_id: "temp_id",
                url: "temp_url"
            },
            owner: req.user._id,
        };

        const newPost = await Post.create(newPostData);
        const user = await User.findById(req.user._id);

        if(!user){
            res.status(404).json({
                success: false,
                message: "user not found",
            });
        }

        user.posts.push(newPost._id);
        await user.save();

        res.status(201).json({
            success: true,
            newPost,
        });
    } 
    catch (error){
        
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


//like and unlike
export const likeAndUnlike = async(req, res) => {

    try {
        
        const post = await Post.findById(req.params.id);

        if(!post){
            res.status(404).json({
                success: false,
                message: "post not found"
            });
        }

        if(post.likes.includes(req.user._id)){

            const index = post.likes.indexOf(req.user._id);
            post.likes.splice(index,1);

            await post.save();

            return res.status(200).json({
                success: true,
                message: "Post unliked",
            });
        }

        else{

            post.likes.push(req.user._id);
            await post.save();

            res.status(200).json({
                success: true,
                message: "Post liked",
            });
        }
    } 
    catch (error) {
        
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


//delete post
export const deletePost = async(req, res) => {

    try {
        
        const post = await Post.findById(req.params.id);

        if(!post){
            res.status(404).json({
                success: false,
                message: "post not found",
            });
        }

        if(post.owner.toString() !== req.user._id.toString()){

            return res.status(401).json({
                success: false,
                message: "unauthorized user",
            });
        }

        await post.deleteOne();

        const user = await User.findById(req.user._id);

        if(!user){
            res.status(404).json({
                success: false,
                message: "user not found",
            });
        }

        const index =  user.posts.indexOf(req.params.id);
        user.posts.splice(index, 1);

        await user.save();

        res.status(200).json({
            success: true,
            message: "post deleted successfully"
        });
    } 
    catch (error) {
        
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

