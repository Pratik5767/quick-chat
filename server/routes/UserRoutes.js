import express from "express"
import { checkAuth, login, signup, updateProfile } from "../controllers/UserController.js"
import { protectRoute } from "../middleware/Auth.js"

const userRoutes = express.Router();

userRoutes.post("/signup", signup);
userRoutes.post("/login", login);
userRoutes.put("/update-profile", protectRoute, updateProfile);
userRoutes.get("/check", protectRoute, checkAuth);

export default userRoutes;