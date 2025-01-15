import { Router} from "express"
import { verifyJWT } from "../middleware/auth.middleware.js"
import { createReview, deleteReview, updateReview, getReviewById } from "../contorller/review.controller.js"

const router = Router()

router.route("/").post(verifyJWT, createReview)
router.route("/:reviewId")
.get(verifyJWT, getReviewById)
.patch(verifyJWT, updateReview)
.delete(verifyJWT, deleteReview)

export default router