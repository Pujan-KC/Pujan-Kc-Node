const mongoose = require("mongoose");

//category schema
var CategorySchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: [true, "Title already Exists"],
  },
  slug: { type: String, unique: true },
  show: { type: Boolean, default: false },
});

var CatModel = (module.exports = mongoose.model("Category", CategorySchema));
