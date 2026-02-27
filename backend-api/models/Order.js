const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        name: String,
        image: String,
        price: Number,
        quantity: Number,
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      email: { type: String },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "Online"],
      default: "COD",
    },
    orderStatus: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
    cancelReason: {
      type: String,
    },
    cancelledAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
