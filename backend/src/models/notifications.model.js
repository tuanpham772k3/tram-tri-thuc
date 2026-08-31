const mongoose = require("mongoose");
const { Schema } = mongoose;

const notificationsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: [
        "book_approved",
        "book_rejected",
        "new_review",
        "order_success",
        "payment_success",
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxLength: 500,
    },

    data: {
      bookId: {
        type: Schema.Types.ObjectId,
        ref: "Book",
      },
      orderId: {
        type: Schema.Types.ObjectId,
        ref: "Order",
      },
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

notificationsSchema.index({ userId: 1, createdAt: -1 });
notificationsSchema.index({ isRead: 1 });

const Notifications = mongoose.model("Notifications", notificationsSchema);

module.exports = Notifications;
