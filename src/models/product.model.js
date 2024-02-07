import mongoose, {Schema} from "mongoose";

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "please provide book name"],
    trim: true,
    maxlength: [120, "Book name should not be more than 120 characters"],
  },
  price: {
    type: Number,
    required: [true, "please provide book price"],
    maxlength: [6, "Book price should not be more than 6 digits"],
  },
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    unique: true,
    required: [true, "please provide book description"],
  },
  photos: [
    {
      id: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },
  ],
  stock: {
    type: Number,
    required: [true, "please add a number in stock"],
  },
  authorName: {
    type: Schema.Types.ObjectId,
    ref:"User"
  },
  ratings: {
    type: Number,
    default: 0,
  },
  numberOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  sellCount: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

export const Product = mongoose.model("Product", productSchema);
