const UserModel = require("../src/models/users");
const PageModel = require("../src/models/page");

//get admin page
const adminpage = async (req, res) => {
  try {
    res.render("admin/admin_index", { title: "Admin" });
  } catch (error) {
    console.log(`Getting admin page error ${error}`);
  }
};
//get users
const users = async (req, res) => {
  try {
    const users = await UserModel.find({ admin: 0 });
    res.render("admin/admin_users", { title: "Users", users: users });
  } catch (error) {
    console.log(`Displaying users ${error}`);
  }
};
//get admins
const admins = async (req, res) => {
  try {
    const admins = await UserModel.find({ admin: 1 });
    res.render("admin/admin_admins", { title: "Admins", admins: admins });
  } catch (error) {
    console.log(`Displaying users ${error}`);
  }
};
//get pages index
const pages = (req, res) => {
  PageModel.find({})
    .sort({ sorting: 1 })
    .exec((err, pages) => {
      res.render("admin/admin_pages", { pages: pages, title: "Custom pages" });
      console.log(req.session.user);
    });
};
//get add pages
const getaddpage = (req, res) => {
  var title = "";
  var slug = "";
  var content = "";
  res.render("admin/add_page", { title: title, sulg: slug, content: content });
};
//post add page
const postaddpage = (req, res) => {
  console.log(req.body);
  var title = req.body.title;
  var slug = req.body.slug.replace(/\s+/g, "-").toLowerCase();
  slug = title.replace(/\+s/g, "-").toLowerCase();
  var content = req.body.content;
  PageModel.findOne({ slug: slug }, function (err, page) {
    if (page) {
      console.log("page exists already");
      return res.render("add_page", { message: "Page title already exists" });
    } else {
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
    }
  });
};
//get edit page
const geteditpage = (req, res) => {
  var _id = req.params.id;
  console.log(_id);
  PageModel.findById({ _id }, (err, page) => {
    if (err) {
      return console.log(`Get error in db  ${err}`);
    }
    res.render("editpage", {
      title: page.title,
      slug: page.slug,
      content: page.content,
      id: page._id,
    });
  });
};
//post edit page
const posteditpage = async (req, res) => {
  try {
    var title = req.body.title;
    console.log(req.body);
    const id = req.params.id;
    var slug = req.body.slug.replace(/\s+/g, "-").toLowerCase();
    if (slug == "") {
      slug = title.replace(/\s+/g, "-").toLowerCase();
    }
    var content = req.body.content;

    var updater = await PageModel.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          content,
          slug,
          title,
        },
      }
    );
    res.redirect("/admin/pages");
    console.log("success");
  } catch (error) {
    console.log(`Editing page error ${error}`);
  }
};
//get delete page
const getdeletepage = async (req, res) => {
  const { _id } = req.params;
  console.log(_id);
  try {
    const terminator = await PageModel.deleteOne({ _id }, { new: true });

    res.redirect("back");
  } catch (err) {
    console.log(`Deleting  page error :  ${err}`);
  }
};

module.exports = {
  adminpage,
  users,
  admins,
  pages,
  getaddpage,
  postaddpage,
  geteditpage,
  posteditpage,
  getdeletepage,
};
