var mongoose = require("mongoose");

//product shcema

var productSchema = mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
    unique: [true, "Sorry the title already exists"],
  },
  stock: { type: Boolean, default: true },
  highlight: { type: Boolean, default: false },
  slug: { type: String, trim: true, unique: true },
  description: { type: String, required: true, trim: true },
  category: { type: String, trim: true, required: true },
  price: { type: Number, required: true, trim: true },
  image: { type: String, default: "noimage.png" },
});

var ProductModel = new mongoose.model("Product", productSchema);
module.exports = ProductModel;
