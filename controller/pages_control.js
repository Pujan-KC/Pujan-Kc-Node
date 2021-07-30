const PageModel = require("../src/models/page");

//get pages index
const pages = (req, res) => {
  PageModel.find({})
    .sort({ sorting: 1 })
    .exec((err, pages) => {
      res.render("admin/admin_pages", { title: "Admin Pages", pages: pages });
      console.log(req.session.user);
    });
};

//get add pages
const getaddpage = (req, res) => {
  var slug = "";
  var content = "";
  res.render("admin/add_page", {
    title: "Add Page",
    sulg: slug,
    content: content,
  });
};

//post add page
const postaddpage = (req, res) => {
  console.log(req.body);
  var title = req.body.title;
  var slug = title.replace(/\s+/g, "-").toLowerCase();
  slug = title.replace(/\s/g, "-").toLowerCase();
  var content = req.body.content;
  PageModel.findOne({ slug: slug }, function (err, page) {
    if (page) {
      console.log("page exists already");
      return res.render("admin/add_page", { message: "page exists" });
    } else
      var page = new PageModel({
        title: title,
        slug: slug,
        content: content,
        sorting: 0,
      });
    page.save(function (err) {
      if (err) return console.log(err);
      req.flash("success", "page added");
      res.redirect("/admin/pages");
    });
  });
};

//get edit page
const geteditpage = (req, res) => {
  var { slug } = req.params;
  console.log(slug);
  PageModel.findOne({ slug }, (err, page) => {
    if (err) {
      return console.log(`Get error in db  ${err}`);
    }
    res.render("admin/editpage", {
      title: "Edit Page",
      page_title: page.title,
      slug: page.slug,
      content: page.content,
      slug: page.slug,
    });
  });
};

//post edit page
const posteditpage = async (req, res) => {
  try {
    var { title, slug, content } = req.body;
    await PageModel.updateOne({ slug }, { $set: { content, title } });
    res.redirect("/admin/pages");
  } catch (error) {
    console.log(`Editing page error ${error}`);
  }
};

//get delete page
const getdeletepage = async (req, res) => {
  const { slug } = req.params;
  try {
    await PageModel.deleteOne({ slug }, { new: true });
    res.redirect("/admin/pages");
  } catch (err) {
    console.log(`Deleting page err :  ${err}`);
  }
};

//show hide dynamic pages
const showpage = async (req, res) => {
  try {
    const { action } = req.query;
    const { slug } = req.params;
    switch (action) {
      case "show":
        await PageModel.updateOne({ slug }, { $set: { show: true } });
        break;
      case "hide":
        await PageModel.updateOne({ slug }, { $set: { show: false } });
      default:
        console.log("Unidetified action");
        break;
    }
    res.redirect("back");
  } catch (error) {
    console.log(`Show / hide dynamic page error ${error}`);
  }
};

module.exports = {
  pages,
  getaddpage,
  postaddpage,
  geteditpage,
  posteditpage,
  getdeletepage,
  showpage,
};
