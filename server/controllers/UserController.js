import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// SignUp a User
export const signup = async (req, res) => {

    try {
        const { fullName, email, password, bio } = req.body;

        if (!fullName || !email || !password || !bio) {
            return res.json({
                success: false,
                message: "Missing Details"
            })
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.json({
                success: false,
                message: "Account already exists"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hassedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName,
            email,
            password: hassedPassword,
            bio
        });

        const token = generateToken(newUser._id);

        return res.json({
            success: true,
            userData: newUser,
            token,
            message: "Account created successfully"
        })
    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            message: error.message
        })
    }
}

// Login a User
export const login = async (req, res) => {

    try {
        const { email, password } = req.body;
        const userData = await User.findOne({ email });

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);
        if (!isPasswordCorrect) {
            res.json({
                success: false,
                message: "Invalid Credentials"
            })
        }

        const token = generateToken(userData._id);

        return res.json({
            success: true,
            userData,
            token,
            message: "Login Successfull"
        })
    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            message: error.message
        })
    }
}

// Controller to check if user is Authenticated
export const checkAuth = (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
}

// Controller  to update user profile details
export const updateProfile = async (req, res) => {

    try {
        const { profilePic, bio, fullName } = req.body;

        const userId = req.user._id;

        let updateUser;
        if (!profilePic) {
            updateUser = await User.findByIdAndUpdate(userId, { bio, fullName }, { new: true });
        } else {
            const upload = await cloudinary.uploader.upload(profilePic);
            updateUser = await User.findByIdAndUpdate(
                userId, {
                profilePic: upload.secure_url,
                bio,
                fullName
            }, { new: true });
        }

        return res.json({
            success: true,
            user: updateUser
        })
    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            message: error.message
        })
    }
}