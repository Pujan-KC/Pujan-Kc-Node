const express = require("express");
const router = express.Router();
const {
  slides_index,
  get_add_slide,
  get_edit_slide,
  post_add_slide,
  post_edit_slide,
  delete_slide,
} = require("../../controller/slide_control");

//slideshow index
router.get("/", slides_index);

//get add slideshow
router.get("/add_slideshow", get_add_slide);

//post add slideshow
router.post("/add_slideshow", post_add_slide);

//get edit slideshow
router.get("/edit_slideshow", get_edit_slide);

//post edit slideshow
router.post("/edit_slideshow/:_id", post_edit_slide);

//get delete slideshow
router.get("/delete_slideshow/:_id/:image", delete_slide);

module.exports = router;
