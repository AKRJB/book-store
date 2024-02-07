import mongoose, { Schema } from 'mongoose';
import { Author } from './author.model.js';
import { mailHelper } from '../utils/emailHelprer.js';

const orderSchema = new Schema(
  {
    shippingInfo: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      phoneNo: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderItems: [
      {
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
      },
    ],
    paymentInfo: {
      id: {
        type: String,
      },
    },
    shippingAmount: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      required: true,
      default: 'processing',
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.post('save', async function () {
  try {
    const author = await Author.findOne({ user: this.user });
    if (author) {
      author.revenue += this.totalAmount;

      await author.save();

      const emailContent = `
        Dear Author,
        You have received a new purchase!
        Purchase Details:
        - Purchase ID: ${this._id}
        - Book ID: ${this.orderItems[0].product}
        - Total Revenue: ${this.totalAmount}
        - Current Month Revenue: ${calculateCurrentMonthRevenue(author)}
        - Current Year Revenue: ${calculateCurrentYearRevenue(author)}
      `;

      try {
        await mailHelper({
          email: this.user.email,
          subject: 'New book purchase notification',
          content: emailContent,
        });
      } catch (error) {
        console.log('Error while sending the mail', error);
      }
    }
  } catch (error) {
    console.error('Error processing purchase:', error);
  }
});

// Calculate current month revenue
function calculateCurrentMonthRevenue(author) {
 const currentMonthPurchases = author.purchases.filter(
    (purchase) =>
      purchase.purchaseDate.getMonth() === new Date().getMonth() &&
      purchase.purchaseDate.getFullYear() === new Date().getFullYear()
  );
  return currentMonthPurchases.reduce((total, purchase) => total + purchase.price * purchase.quantity, 0);
}

// Calculate current year revenue
function calculateCurrentYearRevenue(author) {
  const currentYearPurchases = author.purchases.filter(
    (purchase) => purchase.purchaseDate.getFullYear() === new Date().getFullYear()
  );
  return currentYearPurchases.reduce((total, purchase) => total + purchase.price * purchase.quantity, 0);
}

// Custom method to update sellCount for each product in the order
orderSchema.statics.updateSellCount = async function (orderId) {
  const order = await this.findById(orderId);
  if (!order) {
    throw new Error('Order not found');
  }

  // Increment sellCount for each product in the order
  for (const orderItem of order.orderItems) {
    await Product.findByIdAndUpdate(
      orderItem.product,
      { $inc: { sellCount: orderItem.quantity } },
      { new: true }
    );
  }
};


export const Order = mongoose.model('Order', orderSchema);
