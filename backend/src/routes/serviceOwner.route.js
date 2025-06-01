import {Router} from "express"
import { addServiceImages, approveServiceRequest, deleteServiceOwnerProfile, getServiceProfile, getServiceProfileByUserId, getAllServices, rejectServiceRequest, removeServiceImage, updateServiceCoverImage, updateServiceInfo, upgradeToService } from "../contorller/service.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"
import { upload } from "../middleware/multer.middleware.js"
import { accessToRole } from "../middleware/access.middleware.js"

const router = Router()

router.route("/")
.get(getAllServices)
.post(upload.single("serviceCoverImage", 1), verifyJWT, accessToRole(["user", "admin"]),  upgradeToService)

router.route("/byUserId/:userId").get(verifyJWT, getServiceProfileByUserId)

router.route("/update/:serviceId")
.put(upload.single("serviceCoverImage", 1),verifyJWT, updateServiceCoverImage)

router.route("/reject/:serviceId").delete(verifyJWT, rejectServiceRequest)

router.route("/approve/:userId").post(verifyJWT, approveServiceRequest)

router.route("/:serviceId")
.get(verifyJWT,  getServiceProfile)
.patch(verifyJWT,accessToRole(["serviceOwner", "admin"]),  updateServiceInfo)
.put( upload.array("serviceImages", 5), verifyJWT,accessToRole(["serviceOwner", "admin"]),  addServiceImages)
.post(verifyJWT,accessToRole(["serviceOwner", "admin"]),  removeServiceImage)
.delete(verifyJWT,accessToRole(["serviceOwner", "admin"]),  deleteServiceOwnerProfile)


export default router