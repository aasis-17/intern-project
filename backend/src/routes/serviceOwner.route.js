import {Router} from "express"
import { addServiceImages, deleteServiceOwnerProfile, getServiceProfile, removeServiceImage, updateServiceInfo, upgradeToService } from "../contorller/service.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"
import { upload } from "../middleware/multer.middleware.js"
import { accessToRole } from "../middleware/access.middleware.js"

const router = Router()

router.route("/")
.post(upload.array("serviceImages", 5), verifyJWT,accessToRole(["user"]),  upgradeToService)

router.route("/:serviceId")
.get(verifyJWT,  getServiceProfile)
.patch(verifyJWT,accessToRole(["serviceOwner"]),  updateServiceInfo)
.put( upload.array("serviceImages", 5), verifyJWT,accessToRole(["serviceOwner"]),  addServiceImages)
.post(verifyJWT,accessToRole(["serviceOwner"]),  removeServiceImage)
.delete(verifyJWT,accessToRole(["serviceOwner"]),  deleteServiceOwnerProfile)

export default router