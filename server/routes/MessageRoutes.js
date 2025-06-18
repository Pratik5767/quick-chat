import express from "express"
import { protectRoute } from "../middleware/Auth.js";
import { getMessages, getUsersForSidebar, markMessageAsSeen, sendMessage } from "../controllers/MessageController.js";

const messageRoutes = express.Router();

messageRoutes.get("/users", protectRoute, getUsersForSidebar);
messageRoutes.get("/:id", protectRoute, getMessages);
messageRoutes.put("/mark/:id", protectRoute, markMessageAsSeen);
messageRoutes.post("/send/:id", protectRoute, sendMessage);

export default messageRoutes;