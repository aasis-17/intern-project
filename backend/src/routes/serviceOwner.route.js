import {Router} from "express"
import { addServiceImages, deleteServiceOwnerProfile, getServiceProfile, removeServiceImage, updateServiceInfo, upgradeToService } from "../contorller/service.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"
import { upload } from "../middleware/multer.middleware.js"

const router = Router()

router.route("/")
.post(upload.array("serviceImages", 5), verifyJWT, upgradeToService)

router.route("/:serviceId")
.get(verifyJWT, getServiceProfile)
.patch(verifyJWT, updateServiceInfo)
.put( upload.array("serviceImages", 5), verifyJWT, addServiceImages)
.post(verifyJWT, removeServiceImage)
.delete(verifyJWT, deleteServiceOwnerProfile)

export default router