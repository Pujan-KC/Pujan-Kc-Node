const express = require("express");
const router = express.Router();
const {
  products,
  getaddproducts,
  postaddproducts,
  getdeleteproducts,
  geteditproducts,
  posteditproducts,
  switchstock,
  highlight,
} = require("../../controller/product_control");

//get products index
router.get("/", products);

//get add product
router.get("/add-products", getaddproducts);

//post add products
router.post("/add-products", postaddproducts);

//delete Products
router.get("/delete/product/:slug", getdeleteproducts);

// get edit product
router.get("/edit/product/:slug", geteditproducts);

//Post Edit Product
router.post("/edit/product/:slug", posteditproducts);

//Get switch Stock status
router.get("/stock/:slug", switchstock);

//Get switch highlight
router.get("/highlight/:slug", highlight);

module.exports = router;
