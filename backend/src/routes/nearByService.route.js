import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createNearbyServices, deleteNearByService, updateNearByServiceDetails } from "../contorller/nearByService.controller.js";

const router = Router()

router.route("/")
.post(verifyJWT, createNearbyServices)

router.route("/nearByServiceId")
.patch(verifyJWT, updateNearByServiceDetails)
.delete(verifyJWT, deleteNearByService)

export default router