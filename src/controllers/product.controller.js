import { Product } from "../models/product.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import  { WhereClause } from "../utils/whereClause.js";


const addProduct = asyncHandler(async (req, res, next) => {
  // images
  let imageArray = [];

  if (!req.files) {
      return next(new ApiError("Images are required", 401));
  }

  console.log("RESULT", req.files.photos[0]);

  if (req.files) {
      for (let index = 0; index < req.files.photos.length; index++) {
          let result = await uploadOnCloudinary.upload(
              req.files.photos[index].tempFilePath,
              {
                  folder: "products",
              }
          );

          console.log("RESULT", result);
          imageArray.push({
              id: result.public_id,
              secure_url: result.secure_url,
          });
      }
  }

  req.body.photos = imageArray;
  req.body.user = req.user.id;

  const { name, title, description, authorName, price, stock } = req.body;

  // Validation for required fields
  if ([name, title, description, authorName, price, stock].some(field => field?.trim() === "")) {
      throw new ApiError(400, "All fields are required");
  }

  // Validation for price range (100 to 1000)
  const numericPrice = parseFloat(price);
  if (isNaN(numericPrice) || numericPrice < 100 || numericPrice > 1000) {
      throw new ApiError(400, "Price should be between 100 and 1000");
  }

  const product = await Product.create(
      name,
      title,
      description,
      authorName,
      numericPrice, // Use the validated numericPrice here
      stock,
      imageArray
  );

  res.status(200).json({
      success: true,
      product,
  });
});

const getAllProduct = asyncHandler(async (req, res, next) => {
    const resultPerPage = 3;
    const totalcountProduct = await Product.countDocuments();
  
    const productsObj = new WhereClause(Product.find(), req.query)
      .search()
      .filter();
  
    let products = await productsObj.base;
    const filteredProductNumber = products.length;
  
    productsObj.pager(resultPerPage);
    products = await productsObj.base.clone();
  
    res.status(200).json({
      success: true,
      products,
      filteredProductNumber,
      totalcountProduct,
      resultPerPage,
    });
});
  
const getOneProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
  
    if (!product) {
      return next(new ApiError("No product found with this id", 401));
    }
    res.status(200).json({
      success: true,
      product,
    });
});
  
const addReview = asyncHandler(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
  
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };
  
    const product = await Product.findById(productId);
  
    const AlreadyReview = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );
  
    if (AlreadyReview) {
      product.reviews.forEach((review) => {
        if (review.user.toString() === req.user._id.toString()) {
          review.comment = comment;
          review.rating = rating;
        }
      });
    } else {
      product.reviews.push(review);
      product.numberOfReviews = product.reviews.length;
    }
  
    product.ratings =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;
  
    await product.save({ validateBeforeSave: false });
  
    res.status(200).json({
      success: true,
    });
});
  
const deleteReview = asyncHandler(async (req, res, next) => {
    const { productId } = req.query;
  
    const product = await Product.findById(productId);
  
    const reviews = product.reviews.filter(
      (rev) => rev.user.toString() === req.user._id.toString()
    );
  
    const numberOfReviews = reviews.length;
  
    // adjust ratings
  
    product.ratings =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;
  
    //update the product
  
    await Product.findByIdAndUpdate(
      productId,
      {
        reviews,
        ratings,
        numberOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
  
    res.status(200).json({
      success: true,
    });
});
  
const getOnlyReviewsForOneProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
  
    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
});
  
const adminGetAllProduct = asyncHandler(async (req, res, next) => {
    const products = await Product.find();
  
    res.status(200).json({
      success: true,
      products,
    });
});
  
const adminUpdateOneProduct = asyncHandler(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
  
    if (!product) {
      return next(new ApiError("No product found with this id", 401));
    }
    let imagesArray = [];
  
    if (req.files) {
      //destroy the existing image
      for (let index = 0; index < product.photos.length; index++) {
        const res = await uploadOnCloudinary.v2.uploader.destroy(
          product.photos[index].id
        );
      }
  
      for (let index = 0; index < req.files.photos.length; index++) {
        let result = await uploadOnCloudinary.v2.uploader.upload(
          req.files.photos[index].tempFilePath,
          {
            folder: "products", //folder name -> .env
          }
        );
  
        imagesArray.push({
          id: result.public_id,
          secure_url: result.secure_url,
        });
      }
    }
  
    req.body.photos = imagesArray;
  
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
  
    res.status(200).json({
      success: true,
      product,
    });
});
  
const adminDeleteOneProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
  
    if (!product) {
      return next(new ApiError("No product found with this id", 401));
    }
  
    //destroy the existing image
    for (let index = 0; index < product.photos.length; index++) {
      const res = await uploadOnCloudinary.v2.uploader.destroy(product.photos[index].id);
    }
  
    await product.remove();
  
    res.status(200).json({
      success: true,
      message: "Product was deleted !",
    });
});

export {
    addProduct,
    getAllProduct,
    getOneProduct,
    addReview,
    deleteReview,
    getOnlyReviewsForOneProduct,
    adminGetAllProduct,
    adminDeleteOneProduct,
    adminUpdateOneProduct
}