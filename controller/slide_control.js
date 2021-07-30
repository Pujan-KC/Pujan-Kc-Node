const SlideModel = require("../src/models/slideshow");
const fs = require("fs-extra");

//slideshow index
const slides_index = async (req, res) => {
  try {
    const slides = await SlideModel.find({});
    for (var i = 0; i < slides.length; i++) {
      if (i == 0) slides[i].active = "active";
      slides[i].order = i + 1;
    }
    console.log(slides);

    res.render("admin/admin_slideshow", {
      title: "Slide Show",
      slides: slides,
    });
  } catch (error) {
    console.log(`Displaying slides error ${err}`);
  }
};
//get add slideshow
const get_add_slide = (req, res) => {
  res.render("admin/admin_add_slide", {
    title: "Add Slide-Show Item",
    slideshow: true,
  });
};
//post add slideshow
const post_add_slide = async (req, res) => {
  try {
    //if image is no uploaded
    if (!req.files) {
      const ab = new SlideModel(req.body);
      await ab.save();
      return res.redirect("/admin/pages");
    }
    //if image is uploaded
    const { image } = req.files;
    const imageext = image.name.split(".").pop();
    console.log(imageext);
    const extarry = ["jpg", "png", "jpeg"];
    //returning back if extension is invalid
    if (extarry.indexOf(imageext) == -1) {
      console.log("invalid file extension");
      return res.redirect("back");
    }
    //if extension is valid
    const ab = new SlideModel(req.body);
    ab.image = ab._id + "." + imageext;
    image.mv("public/slideshow_images/" + ab.image, (err) => {
      if (err) console.log("adding image error", err);
    });
    await ab.save();
    res.redirect("/admin/pages");
  } catch (error) {
    console.log(`Adding slideshow error ${error}`);
  }
};
//get edit slideshow
const get_edit_slide = async (req, res) => {
  try {
    const SlideShow = await SlideModel.find({});
    res.render("admin/admin_edit_slideshow", {
      editslideshow: true,
      SlideShow: SlideShow,
      title: "Edit SlideShow",
    });
  } catch (error) {
    console.log(`Getting slideshow data error ${error}`);
  }
};
//post edit slideshow
const post_edit_slide = async (req, res) => {
  try {
    const { _id } = req.params;
    //if image is not updated
    if (!req.files) {
      await SlideModel.updateOne({ _id }, { $set: req.body });
      return res.redirect("back");
    }
    //if image is updated
    const { image } = req.files;
    const imageext = image.name.split(".").pop();
    const extarray = ["jpg", "png", "jpeg"];
    //if extension is invalid
    if (extarray.indexOf(imageext) == -1) {
      console.log("invalid File extension ");
      return res.redirect("back");
    }
    //if extension is valid
    const data = await SlideModel.findById({ _id });
    //if image exists
    if (data.image != "no image.jpg") {
      fs.remove("public/slideshow_images/data.image", (err) => {
        if (err) console.log("removing image error", err);
      });
    }
    //if image does not exists
    req.body.image = data._id + "." + imageext;
    await SlideModel.updateOne({ _id }, { $set: req.body });
    image.mv("public/slideshow_images/" + req.body.image, (err) => {
      if (err) {
        console.log(`Adding Image error ${err}`);
      }
      console.log("Image Updated");
      req.flash("success", "product edited");
      res.redirect("back");
    });

    console.log(imageext);
  } catch (error) {
    console.log(`Editing slideshow error ${error}`);
  }
};
//get delete slideshow
const delete_slide = async (req, res) => {
  try {
    const { _id, image } = req.params;
    if (image == "no image.jpg") {
      await SlideModel.findByIdAndDelete({ _id });
      return res.redirect("back");
    }
    fs.remove("public/slideshow_images/" + image, (err) => {
      if (err) console.log(`removing slide image error ${err}`);
    });
    await SlideModel.findByIdAndDelete({ _id });
    return res.redirect("back");
  } catch (error) {
    console.log(`Deleting slideshow item error ${error}`);
  }
};

module.exports = {
  slides_index,
  get_add_slide,
  get_edit_slide,
  post_add_slide,
  post_edit_slide,
  delete_slide,
};
