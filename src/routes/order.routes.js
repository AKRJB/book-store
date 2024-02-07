import { Router } from "express";

import {
    createOrder,
    getOneOrder,
    getLoggedInOrders,
    admingetAllOrders,
    adminUpdateOrder,
    adminDeleteOrder
} from "../controllers/order.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { customRole } from "../middlewares/userRole.js";

const router = Router()

router.route("/order/create").post(verifyJWT, createOrder);
router.route("/order/:id").get(verifyJWT, getOneOrder);
router.route("/myorder").get(verifyJWT, getLoggedInOrders);

//admin routes
router
  .route("/admin/orders")
  .get(verifyJWT, customRole("admin"), admingetAllOrders);
router
  .route("/admin/order/:id")
  .put(verifyJWT, customRole("admin"), adminUpdateOrder)
  .delete(verifyJWT, customRole("admin"), adminDeleteOrder);


export default router