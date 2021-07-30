const express = require("express");
const router = express.Router();
const {
  pages,
  getaddpage,
  postaddpage,
  geteditpage,
  posteditpage,
  getdeletepage,
  showpage,
} = require("../../controller/pages_control.js");

//get pages index
router.get("/", pages);

//get  add pages
router.get("/add_page", getaddpage);

//Post add pages
router.post("/add_page", postaddpage);

//get edit page
router.get("/edit/page/:slug", geteditpage);

//post edit page
router.post("/editpage/:id", posteditpage);

//deleting page
router.get("/delete/page/:slug", getdeletepage);

//showing hiding dynamic page
router.get("/showpage/:slug", showpage);

module.exports = router;
