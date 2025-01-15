import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload} from "../middleware/multer.middleware.js"
import { addDestinationImage, getDestinationById, updateDestination, deleteDestination, deleteDestinationImage, createDestination, updateDestinationCoverImage } from "../contorller/destination.controller.js";
import { accessToRole } from "../middleware/access.middleware.js";

const router = Router()

router.route("/").post(upload.fields([{
    name : "destinationCoverImage",
    maxCount : 1
    },
    {
    name : "destinationImages",
    maxCount : 5
    }]), verifyJWT,accessToRole(["admin"]), createDestination)

router.route("/coverImage/:destinationId")
.put(upload.single("destinationCoverImage", 1),verifyJWT,accessToRole(["admin"]), updateDestinationCoverImage)

router.route("/:destinationId")
.get(verifyJWT,accessToRole(["admin"]), getDestinationById)
.patch(verifyJWT,accessToRole(["admin"]), updateDestination)
.put(upload.array("destinationImages", 5),verifyJWT,accessToRole(["admin"]), addDestinationImage)
.post(verifyJWT,accessToRole(["admin"]), deleteDestinationImage)
.delete(verifyJWT,accessToRole(["admin"]), deleteDestination)


export default router
