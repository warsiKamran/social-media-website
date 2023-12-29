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


//get post of the user which we are following
export const getPost = async(req, res) => {

    try {
        
        const user = await User.findById(req.user._id);

        const posts = await Post.find({
            owner: {
                $in: user.following,      //it will return the array where the id will match
            }
        });

        res.status(200).json({
            success: true,
            posts,
        });
    } 
    catch (error) {
        
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


//update post caption
export const updateCaption = async(req, res) => {

    try {
        
        const post = await Post.findById(req.params.id);
        const {caption} = req.body;

        if(!post){
            return res.status(404).json({
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

        post.caption = caption;
        await post.save();

        return res.status(200).json({
            success: true,
            message: "caption updated",
        });
    } 
    catch (error) {
        
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


//add and update comment
export const addAndUpdateComment = async(req, res) => {

    try {
        
        const {id} = req.params;
        const post = await Post.findById(id);

        if(!post){
            return res.status(404).json({
                success: false,
                message: "post not found",
            });
        }

        let comment_idx = -1;

        post.comments.forEach((item, index) => {

            if(item.user.toString() == req.user._id.toString()){
                comment_idx = index;
            }
        });

        if(comment_idx !== -1){

            post.comments[comment_idx].comment = req.body.comment;
            await post.save();

            return res.status(200).json({
                success: true,
                message: "comment updated",
            });
        }
        else{

            post.comments.push({
                user: req.user._id,
                comment: req.body.comment,
            });

            await post.save();

            return res.status(200).json({
                success: true,
                message: "comment added",
            });
        }
    } 
    catch (error){
        
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


//delete comment
export const deleteComment = async(req, res) => {

    try {
        
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({
                success: false,
                message: "post not found",
            });
        }

        if(post.owner.toString() === req.user._id.toString()){

            if(req.body.commentId == undefined){

                return res.status(400).json({
                    success: false,
                    message: "commenId id required",
                });
            }

            post.comments.forEach((item, index) => {

                if(item._id.toString() === req.body.commentId.toString()){

                    return post.comments.splice(index, 1);
                }
            });

            await post.save();

            return res.status(200).json({
                success: false,
                message: "selected comment has been deleted",
            });
        }
        else{

            post.comments.forEach((item, index) => {

                if(item.user.toString() === req.user._id.toString()){

                    return post.comments.splice(index, 1);
                }
            });

            await post.save();

            return res.status(200).json({
                success: true,
                message: "your comment has been deleted",
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

