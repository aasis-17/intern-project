import { Router } from "express";
import { getCurrentUser, updateUserAvatar, updateUserInfo } from "../contorller/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router()

router.route("/")
.patch(verifyJWT, updateUserInfo)
.put(upload.single("userAvatar"),verifyJWT, updateUserAvatar)
.get(verifyJWT, getCurrentUser)

export default router 