import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { addDestinationImage, getDestinationById, updateDestination, deleteDestination, deleteDestinationImage, createDestination, updateDestinationCoverImage } from "../contorller/destination.controller.js";

const router = Router()

router.route("/").post(verifyJWT, createDestination)

router.route("/coverImage/:destination")
.put(verifyJWT, updateDestinationCoverImage)

router.route("/:destinationId")
.get(verifyJWT, getDestinationById)
.patch(verifyJWT, updateDestination)
.put(verifyJWT, addDestinationImage)
.post(verifyJWT, deleteDestinationImage)
.delete(verifyJWT, deleteDestination)


export default router
