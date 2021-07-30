const PageModel = require("../src/models/page");
const CatModel = require("../src/models/catmodel");
const ProductModel = require("../src/models/product");
const SlideModel = require("../src/models/slideshow");

//Get home index
const home = async (req, res) => {
  try {
    //geting slide show
    const slides = await SlideModel.find({});
    for (var i = 0; i < slides.length; i++) {
      if (i == 0) slides[i].active = "active";
      slides[i].order = i + 1;
    }
    const products = await ProductModel.find({ highlight: true }).limit(18);
    const categories = await CatModel.find({ show: true });
    const pages = await PageModel.find({ show: true });
    //rendering home page
    res.render("index", {
      slides: slides,
      pages: pages,
      categories: categories,
      products: products,
    });
  } catch (error) {
    console.log(`Rendering home page error ${error}`);
  }
};
//Get All products
const allproducts = async (req, res) => {
  try {
    const Products = await ProductModel.find({});
    const Categories = await CatModel.find({});
    //rendering all products view
    res.render("all_products", {
      title: "All Products",
      categories: Categories,
      products: Products,
    });
  } catch (error) {
    console.log(`Displaying all products error ${error}`);
  }
};
//contactus
const contactus = async (req, res) => {
  console.log("about us page");
  res.render("contact_us");
};
//get products by category
const productbycategory = async (req, res) => {
  const { category } = req.params;
  const categories = await CatModel.find({});
  const products = await ProductModel.find({ category: category });
  res.render("all_products", {
    title: category,
    products: products,
    categories: categories,
  });
};
//Get pages
const getpages = async (req, res) => {
  try {
    const { slug } = req.params;
    const page = await PageModel.findOne({ slug });
    console.log(page);
    res.render("custom_page", { title: page.title, content: page.content });
  } catch (error) {
    console.log(`Getting pages error ${error}`);
    res.redirect("/");
  }
};
//get product detail
const product_detail = async (req, res) => {
  try {
    const { _id } = req.params;
    console.log(_id);
    const product = await ProductModel.findOne({ slug: _id });
    res.render("product_details", { title: product.title, product: product });
    console.log(_id);
  } catch (error) {
    console.log(`Getting product detail error`);
  }
};

module.exports = {
  home,
  allproducts,
  getpages,
  product_detail,
  productbycategory,
  contactus,
};
