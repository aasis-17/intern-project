import {Router} from "express"
import { addServiceImages, approveServiceRequest, deleteServiceOwnerProfile, getServiceProfile, getServiceProfileByUserId, getServiceRequest, rejectServiceRequest, removeServiceImage, updateServiceCoverImage, updateServiceInfo, upgradeToService } from "../contorller/service.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"
import { upload } from "../middleware/multer.middleware.js"
import { accessToRole } from "../middleware/access.middleware.js"

const router = Router()

router.route("/")
.get(verifyJWT, accessToRole(["admin"]),getServiceRequest)
.post(upload.single("serviceCoverImage", 1), verifyJWT,accessToRole(["user"]),  upgradeToService)

router.route("/:userId").get(verifyJWT, getServiceProfileByUserId)

router.route("/update/:serviceId")
.put(upload.single("serviceCoverImage", 1),verifyJWT, updateServiceCoverImage)

router.route("/reject/:serviceId").delete(verifyJWT, rejectServiceRequest)

router.route("/approve/:userId").post(verifyJWT, approveServiceRequest)

router.route("/:serviceId")
.get(verifyJWT,  getServiceProfile)
.patch(verifyJWT,accessToRole(["serviceOwner"]),  updateServiceInfo)
.put( upload.array("serviceImages", 5), verifyJWT,accessToRole(["serviceOwner"]),  addServiceImages)
.post(verifyJWT,accessToRole(["serviceOwner"]),  removeServiceImage)
.delete(verifyJWT,accessToRole(["serviceOwner"]),  deleteServiceOwnerProfile)


export default router