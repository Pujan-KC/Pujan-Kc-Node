const express = require("express");
const router = express.Router();
const {
  category,
  getaddcategory,
  postaddcategory,
  geteditcategory,
  posteditcategory,
  getdeletecategory,
  showcat,
} = require("../../controller/category_control");

//get category index
router.get("/", category);

//get add category
router.get("/add-category", getaddcategory);

//Post add category
router.post("/add-category", postaddcategory);

//get edit category
router.get("/edit/category/:id", geteditcategory);

// post edit category
router.post("/edit/category/:_id", posteditcategory);

//delete category
router.get("/delete/category/:_id", getdeletecategory);

//show or hide category
router.get("/show/:slug", showcat);

module.exports = router;
