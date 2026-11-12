const mongoose = require("mongoose");
const { Schema } = mongoose;

const paymentSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    provider: {
      type: String,
      enum: ["zalopay", "momo", "stripe"],
      required: true,
    },

    transactionId: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },

    paidAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

paymentSchema.index({ orderId: 1, status: 1 }, { unique: true });

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
