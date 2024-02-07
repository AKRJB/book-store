import { Router } from "express";
import { 
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    forgotPassword,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    adminAllUser,
    admingetOneUser,
    adminUpdateOneUserDetails,
    adminDeleteOneUser,
    orderHistory
} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { customRole } from "../middlewares/userRole.js";


const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]),
    registerUser
    )

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT,  logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/forgotPassword").post(forgotPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)

router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/history").get(verifyJWT, orderHistory)

//admin only routes
router.route("/admin/users").get(verifyJWT, customRole("admin"), adminAllUser);
router
  .route("/admin/user/:id")
  .get(verifyJWT, customRole("admin"), admingetOneUser)
  .put(verifyJWT, customRole("admin"), adminUpdateOneUserDetails)
  .delete(verifyJWT, customRole("admin"), adminDeleteOneUser);


export default router