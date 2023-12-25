import { User } from "../models/User.js";
import { sendToken } from "../utils/sendToken.js";

// signup
export const signup = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter all the fields",
            });
        }

        let user = await User.findOne({ email });

        if (user) {
            return res.status(409).json({
                success: false,
                message: "User already exists",
            });
        }

        user = await User.create({
            name,
            email,
            password,
            avatar: {
                public_id: "temp_id",
                url: "temp_url",
            },
        });

        sendToken(res, user, `Signed up successfully`, 200);
    }
    catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


//login
export const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter all the fields",
            });
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(409).json({
                success: false,
                message: "User not signed in",
            });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Incorrect Password",
            });
        }

        sendToken(res, user, `Welcome back ${user.name}`, 200);
    }
    catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


//logout
export const logout = async (req, res) => {

    try {

        const options = {

            expires: new Date(Date.now()),
            httpOnly: true,
            secure: true,
            sameSite: "none",
        }

        res.status(200).cookie("token", null, options).json({

            success: true,
            message: "Logged out successfully",
        });
    }

    catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


//follow and unfollow
export const followAndUnfollow = async (req, res) => {

    try {

        const user_to_follow = await User.findById(req.params.id);
        const logged_user = await User.findById(req.user._id);

        if (!user_to_follow) {
            res.status(404).json({
                success: false,
                message: "user not found",
            });
        }

        if (logged_user.following.includes(user_to_follow._id)) {

            //removing from logged in user
            const index_following = logged_user.following.indexOf(user_to_follow._id);
            logged_user.following.splice(index_following, 1);

            //removing followed by
            const index_followers = user_to_follow.followers.indexOf(logged_user._id);
            user_to_follow.followers.splice(index_followers, 1);

            await logged_user.save();
            await user_to_follow.save();

            res.status(201).json({
                success: true,
                message: "user unfollowed"
            })
        }

        else {

            logged_user.following.push(req.params.id);
            user_to_follow.followers.push(req.user._id);

            await logged_user.save();
            await user_to_follow.save();

            res.status(200).json({
                success: true,
                message: "user followed ",
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

