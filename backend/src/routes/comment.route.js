import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createComment, deleteComment, getCommentById, updateComment } from "../contorller/comment.controller.js";

const router = Router()

router.route("/").post(verifyJWT, createComment)

router.route("/:commentId")
.get(verifyJWT, getCommentById)
.patch(verifyJWT, updateComment)
.delete(verifyJWT, deleteComment)

export default router