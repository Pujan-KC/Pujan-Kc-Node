const CatModel = require("../src/models/catmodel");

//get category index
const category = async (req, res) => {
  try {
    const cats = await CatModel.find({});
    res.render("admin/admin_categories", {
      title: "Admin Categories",
      cats: cats,
    });
  } catch (err) {
    console.log(`Catched Error ${err}`);
  }
};

//get add category
const getaddcategory = (req, res) => {
  res.render("admin/add_category", { title: "Add category" });
};

//post add category
const postaddcategory = async (req, res) => {
  var message = "";
  try {
    const title = req.body.title;

    if (title.length == 0) {
      message = "Title must have value";
    } else {
      var slug = title.replace(/\s+/g, "-").toLowerCase();

      const ab = new CatModel({
        title,
        slug,
      });
      await ab.save();
      res.redirect("/admin/categories");
    }
  } catch (err) {
    console.log(`Add category Error ${err}`);
    message = "server error   " + err;
  }
  res.render("admin/add_category", { message: message, title: "Add category" });
};

//get edit category
const geteditcategory = async (req, res) => {
  try {
    id = req.params.id;
    const finder = await CatModel.findById({ _id: id });

    res.render("admin/edit_category", { title: finder.title, id: finder._id });
  } catch (err) {
    console.log(`finding category erro ${err}`);
  }
};

//post edit category =
const posteditcategory = async (req, res) => {
  try {
    const { _id } = req.params;
    const updater = await CatModel.findByIdAndUpdate(
      { _id },
      { $set: { title: req.body.title } }
    );
    res.redirect("/admin/categories");
  } catch (err) {
    console.log(`Editing category error ${err}`);
  }
};

//get delete category
const getdeletecategory = async (req, res) => {
  try {
    const { _id } = req.params;
    const terminator = await CatModel.findByIdAndDelete({ _id });
    res.redirect("/admin/categories");
    console.log(terminator);
  } catch (err) {
    console.log(`Deleting category Error ${err}`);
  }
};
//show or hide category in nav
const showcat = async (req, res) => {
  try {
    const { slug } = req.params;
    const { action } = req.query;
    switch (action) {
      case "hide":
        await CatModel.updateOne({ slug }, { $set: { show: false } });
        break;
      case "show":
        await CatModel.updateOne({ slug }, { $set: { show: true } });
      default:
        console.log("undetified action for categry status update");
        break;
    }
    res.redirect("back");
  } catch (error) {
    console.log(`Changing category status error ${error}`);
  }
};

module.exports = {
  category,
  getaddcategory,
  postaddcategory,
  geteditcategory,
  posteditcategory,
  getdeletecategory,
  showcat,
};
