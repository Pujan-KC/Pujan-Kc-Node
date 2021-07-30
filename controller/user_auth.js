const ProductModel = require("../src/models/product");

const auth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else res.render("login", { message: "Please login first", title: Login });
};

const stock = async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const product = await ProductModel.findOne({ slug });
    if (product.stock) {
      next();
    } else {
      console.log("out of stock product");
      req.flash("hello", "mello");
      res.redirect("back");
    }
  } catch (error) {
    console.log(`checking Product Stock status error,${error}`);
  }
};
module.exports = { auth, stock };
