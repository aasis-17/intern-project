import {Router} from "express"
import { upload } from "../middleware/multer.middleware.js"
import { addGuideImages, deleteGuideAccount, getGuideProfile, removeGuideImage, updateGuideInfo, updateRoleToGuide } from "../contorller/guide.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"

const router = Router()

router.route("/")
.post(upload.array("guideImage", 5),verifyJWT, updateRoleToGuide)

router.route("/:guideId")
.get(verifyJWT, getGuideProfile)
.put( upload.array("guideImage", 5), verifyJWT, addGuideImages)
.patch(verifyJWT, updateGuideInfo)
.post(verifyJWT, removeGuideImage)
.delete(verifyJWT, deleteGuideAccount)

export default router