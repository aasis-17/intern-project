import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { totalDestinationCount, totalServiceCount, totalUserCount } from "../contorller/dashboard.controller.js";

const router = Router()

router.route("/")
.get(verifyJWT, totalDestinationCount)

router.route("/user")
.get(verifyJWT, totalUserCount)

router.route("/service")
.get(verifyJWT, totalServiceCount)

export default router