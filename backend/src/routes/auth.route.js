import { Router } from "express";
import { login, logout, signup, updatePassword } from "../contorller/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router()

router.route("/signup").post(signup)

router.route("/")
.post(login)
.get(verifyJWT, logout)
.patch(verifyJWT, updatePassword)

export default router