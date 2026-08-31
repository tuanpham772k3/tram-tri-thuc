const mongoose = require("mongoose");
const { Schema } = mongoose;

const paymentsSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      require: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },

    provider: {
      type: String,
      enum: ["zalopay", "momo", "stripe"],
    },

    transactionId: {
      type: String,
      require: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1000,
    },

    status: {
      type: String,
      enum: ["pending", "success", "failed"],
    },

    paidAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Payments = mongoose.model("Payments", paymentsSchema);

module.exports = Payments;
