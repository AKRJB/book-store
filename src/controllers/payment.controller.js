import Razorpay from "razorpay";
import { asyncHandler } from "../utils/asyncHandler.js";

const sendRazorpayKey = asyncHandler(async (req, res, next) => {
    res.status(200).json({
      razorpaykey: process.env.RAZORPAY_API_KEY,
    });
  });
  
  const captureRazorpayPayment = asyncHandler(async (req, res, next) => {
    var instance = new Razorpay({
      key_id: process.env.RAZORPAY_API_KEY,
      key_secret: process.env.RAZORPAY_SECRET,
    });
  
    var options = {
      amount: req.body.amount,
      currency: "INR",
    };
    console.log(req.body.amount);
    const myOrder = await instance.orders.create(options);
  
    res.status(200).json({
      success: true,
      amount: req.body.amount,
      order: myOrder,
    });
  });

export {
    sendRazorpayKey,
    captureRazorpayPayment
}