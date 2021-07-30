const express = require("express");
const router = express.Router();

const { auth } = require("../../controller/user_auth");
const {
  get_login,
  get_register,
  post_register,
  post_login,
  logout,
  add_wishlist,
  update_wishlist,
  clear_wishlist,
} = require("../../controller/user_control");

//get register
router.get("/register", get_register);

//post register
router.post("/register", post_register);

//get login
router.get("/login", get_login);

//post login
router.post("/login", post_login);

//logout
router.get("/logout", logout);

//add to wishlist
router.get("/addwishlist/:slug", auth, add_wishlist);

//updating wishlist
router.get("/wishlist/update/:slug", update_wishlist);

//clearing wishlist
router.get("/wishlist/clear", clear_wishlist);

module.exports = router;
