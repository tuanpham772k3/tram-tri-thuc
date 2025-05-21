const mongoose = require("mongoose");
const { Schema } = mongoose;

const CategorySchema = new Schema({
    name: { type: String, required: true, trim: true, maxlength: 100 },
    slug: { type: String, required: true, unique: true, match: /^[a-z0-9-]+$/ },
    description: { type: String, maxlength: 500 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

CategorySchema.pre("save", function (next) {
    this.updatedAt = new Date();
    next();
});

CategorySchema.index({ slug: 1 });

module.exports = mongoose.model("Category", CategorySchema);
