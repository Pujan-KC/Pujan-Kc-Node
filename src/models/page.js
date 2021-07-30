var mongoose = require("mongoose");

//Page Schema
var pageSchema = mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String },
  content: { type: String, required: true },
  sorting: { type: Number },
  show: { type: Boolean, defalult: false },
});

var PageModel = (module.exports = new mongoose.model("Page", pageSchema));
