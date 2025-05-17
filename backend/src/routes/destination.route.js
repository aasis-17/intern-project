import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload} from "../middleware/multer.middleware.js"
import { addDestinationImage, getDestinationById, updateDestination, deleteDestination, deleteDestinationImage, createDestination, getAllDestination, addRoutePlan, removeRoutePlan, getAllDestinationName } from "../contorller/destination.controller.js";
import { accessToRole } from "../middleware/access.middleware.js";

const router = Router()

router.route("/")
.get( getAllDestination)
.patch(getAllDestinationName)
.post(upload.fields([{
    name : "destinationCoverImage",
    maxCount : 1
    },
    {
    name : "destinationImages",
    maxCount : 5
    }]), verifyJWT, accessToRole(["admin"]), createDestination)

router.route("/route/:destinationId")
.post(verifyJWT,accessToRole(["admin"]), addRoutePlan)
.patch(verifyJWT, removeRoutePlan)

router.route("/:destinationId")
.get(getDestinationById)
.patch(upload.single("destinationCoverImage", 1), verifyJWT,accessToRole(["admin"]), updateDestination)
.put(upload.array("destinationImages", 5),verifyJWT,accessToRole(["admin"]), addDestinationImage)
.post(verifyJWT,accessToRole(["admin"]), deleteDestinationImage)
.delete(verifyJWT,accessToRole(["admin"]), deleteDestination)


export default router
