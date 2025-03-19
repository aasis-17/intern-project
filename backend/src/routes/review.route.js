import { Router} from "express"
import { verifyJWT } from "../middleware/auth.middleware.js"
import { createReview, deleteReview, updateReview, getReviewById, getReviews } from "../contorller/review.controller.js"

const router = Router()

router.route("/")
.get(getReviews)
.post(verifyJWT, createReview)

router.route("/:reviewId")
.get(verifyJWT, getReviewById)
.patch(verifyJWT, updateReview)
.delete(verifyJWT, deleteReview)

export default router