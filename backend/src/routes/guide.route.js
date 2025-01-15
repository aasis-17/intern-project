import {Router} from "express"
import { upload } from "../middleware/multer.middleware.js"
import { addGuideImages, deleteGuideAccount, getGuideProfile, removeGuideImage, updateGuideInfo, updateRoleToGuide } from "../contorller/guide.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"
import { accessToRole } from "../middleware/access.middleware.js"

const router = Router()

router.route("/")
.post(upload.array("guideImage", 5),verifyJWT,accessToRole(["user"]), updateRoleToGuide)

router.route("/:guideId")
.get(verifyJWT,  getGuideProfile)
.put( upload.array("guideImage", 5),accessToRole(["guide"]),  verifyJWT, addGuideImages)
.patch(verifyJWT,accessToRole(["guide"]),  updateGuideInfo)
.post(verifyJWT,accessToRole(["guide"]),  removeGuideImage)
.delete(verifyJWT,accessToRole(["guide"]),  deleteGuideAccount)

export default router