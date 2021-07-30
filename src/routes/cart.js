const express = require("express");
const router = express.Router();
const {
  addtocart,
  checkout,
  updatecart,
  clearcart,
} = require("../../controller/cart_control");

//geting user authentication middleware
const { auth, stock } = require("../../controller/user_auth");

// Adding to cart with session
router.get("/add/:slug", stock, auth, addtocart);

//Get checkout page
router.get("/checkout", auth, stock, checkout);

//Get update product
router.get("/update/:product", auth, stock, updatecart);

//get clear cart
router.get("/clear", auth, clearcart);

module.exports = router;
