const express = require("express");
const router = express.Router();
const {
  home,
  allproducts,
  contactus,
  getpages,
  productbycategory,
  product_detail,
} = require("../../controller/control");
const ProductModel = require("../models/product");

//get index
router.get("/", home);

//view all products
router.get("/products/view", allproducts);

//get product detail
router.get("/products/view/detail/:_id", product_detail);

//get products by category
router.get("/products/view/categories/:category", productbycategory);

// get pages
router.get("/get/:slug", getpages);

//about us
router.get("/contact_us", contactus);

module.exports = router;
