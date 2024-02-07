import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
    sendRazorpayKey,
    captureRazorpayPayment
} from "../controllers/payment.controller.js";


const router = Router()


router.route("/razorpaykey").get(verifyJWT, sendRazorpayKey);
router.route("/capturerazorpay").post(verifyJWT, captureRazorpayPayment);

export default router