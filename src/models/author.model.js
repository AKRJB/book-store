import mongoose, { Schema } from "mongoose";

const authorSchema = new Schema(
  {
    author:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    revenue: {
      type: Number,
      default: 0,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    purchases: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Order',
        },
      ],
  },
  { timestamps: true }
);

export const Author = mongoose.model("Author", authorSchema);
