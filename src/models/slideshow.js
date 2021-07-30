var mongoose = require("mongoose");

//Page Schema
var slideshowSchema = mongoose.Schema({
  heading: { type: String, required: true },
  image: { type: String, default: "no image.jpg" },
  content: { type: String, required: true },
  order: { type: Number, default: "" },
  active: { type: String, required: false },
});

var SlideModel = (module.exports = new mongoose.model(
  "Slide",
  slideshowSchema
));
