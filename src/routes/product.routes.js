import { Router } from "express";
import { 
    addProduct,
    getAllProduct,
    getOneProduct,
    addReview,
    deleteReview,
    getOnlyReviewsForOneProduct,
    adminGetAllProduct,
    adminDeleteOneProduct,
    adminUpdateOneProduct
} from "../controllers/product.controller.js";

import { customRole } from "../middlewares/userRole.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

//user routes
router.route("/products").get(getAllProduct);
router.route("/product/:id").get(getOneProduct);
router.route("/review").put(verifyJWT, addReview);
router.route("/review").delete(verifyJWT, deleteReview);
router.route("/reviews").get(verifyJWT, getOnlyReviewsForOneProduct);

//admin routes
router
  .route("/admin/product/add")
  .post(verifyJWT, upload.fields([
    {
        name: "book images",
        maxCount: 5
    }
]), customRole("admin"), addProduct);

router
  .route("/admin/products")
  .get(verifyJWT, customRole("admin"), adminGetAllProduct);

router
  .route("/admin/product/:id")
  .put(verifyJWT, customRole("admin"), adminUpdateOneProduct)
  .delete(verifyJWT, customRole("admin"), adminDeleteOneProduct);


export default router