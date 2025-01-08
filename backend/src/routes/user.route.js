import { Router } from "express";
import { login, logout, signup, updatePassword, updateUserAvatar, updateUserInfo } from "../contorller/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router()

router.route("/")
.patch(verifyJWT, updateUserInfo)
.put(upload.single("userAvatar"), verifyJWT, updateUserAvatar)
.post(verifyJWT, updatePassword)

router.route("/login").post(login)

router.route("/signup").post(signup)

router.route("/logout").get(verifyJWT, logout)

export default router 