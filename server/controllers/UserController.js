import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// SignUp a User
export const signup = async (req, res) => {
    const { fullName, email, password, bio } = req.body;

    try {
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