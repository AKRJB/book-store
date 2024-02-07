import { Order } from "../models/order.model.js"
import { Product } from "../models/product.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const createOrder = asyncHandler (async (req, res, next) => {
    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      shippingAmount,
      totalAmount,
    } = req.body;
  
    const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      shippingAmount,
      totalAmount,
      user: req.user._id,
    });

    await Order.updateSellCount(order._id);
  
    res.status(200).json({
      success: true,
      order,
    });
});

const getOneOrder = asyncHandler (async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );
  
    if (!order) {
      return next(new ApiError ("please check order id", 401));
    }
  
    res.status(200).json({
      success: true,
      order,
    });
});
  
const getLoggedInOrders = asyncHandler (async (req, res, next) => {
    const order = await Order.find({ user: req.user._id });
  
    if (!order) {
      return next(new ApiError("please check order id", 401));
    }
  
    res.status(200).json({
      success: true,
      order,
    });
});
  
const admingetAllOrders = asyncHandler (async (req, res, next) => {
    const orders = await Order.find();
  
    res.status(200).json({
      success: true,
      orders,
    });
});
  
const adminUpdateOrder = asyncHandler (async (req, res, next) => {
    const order = await Order.findById(req.params.id);
  
    if (order.orderStatus === "Delivered") {
      return next(new ApiError("Order is already marked for delivered", 401));
    }
  
    order.orderStatus = req.body.orderStatus;
  
    order.orderItems.forEach(async (prod) => {
      await updateProductStock(prod.product, prod.quantity);
    });
  
    await order.save();
  
    res.status(200).json({
      success: true,
      order,
    });
});
  
const adminDeleteOrder = asyncHandler (async (req, res, next) => {
    const order = await Order.findById(req.params.id);
  
    await order.remove();
  
    res.status(200).json({
      success: true,
    });
});
  
async function updateProductStock(productId, quantity) {
    const product = await Product.findById(productId);
  
    product.stock = product.stock - quantity;
  
    await product.save({ validateBeforeSave: false });
}

export {
    createOrder,
    getOneOrder,
    getLoggedInOrders,
    admingetAllOrders,
    adminUpdateOrder,
    adminDeleteOrder
}