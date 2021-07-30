var ProductModel = require("../src/models/product");
var CatModel = require("../src/models/catmodel");
const fs = require("fs-extra");

//get product index
const products = async (req, res) => {
  try {
    const products = await ProductModel.find({});
    const count = await ProductModel.countDocuments();
    res.render("admin/admin_products", {
      title: "Admin Products",
      products: products,
      count: count,
    });
  } catch (err) {
    console.log(`Product index page error ${err}`);
  }
};

//get add products
const getaddproducts = async (req, res) => {
  try {
    const category = await CatModel.find({});
    res.render("admin/add_products", {
      categories: category,
      title: "Add products",
    });
  } catch (error) {
    console.log("get add product error", error);
  }
};

//post add products
const postaddproducts = async (req, res) => {
  try {
    const categories = await CatModel.find({});
    var ab = null;
    const title = req.body.title;
    var slug = title.replace(/\s/g, "-").toLowerCase();
    req.body.slug = slug;

    //Image not uploaded
    if (req.files == null) {
      req.body.image = "";
      ab = new ProductModel(req.body);
      const saver = await ab.save();
      console.log("data added");
      return res.redirect("/admin/products");
    }
    //Image uploaded
    else {
      const image = req.files.image;
      const ext = image.name.split(".").pop();
      const extarray = ["jpg", "png", "jpeg"];
      //If extension is invalid
      if (extarray.indexOf(ext) == -1) {
        return res.render("admin/add_products", {
          categories: categories,
          message: " Must have Image with  format of .jpg,.png or .jpeg",
        });
      }
      //If extension is valid
      else {
        req.body.image = req.body.title.concat(".", ext);
        ab = new ProductModel(req.body);

        const saver = await ab.save();

        image.mv("public/product_images/" + ab.image, (err) => {
          if (err) console.log(err);
          res.redirect("/admin/products");
        });
      }
    }
  } catch (error) {
    console.log(`Adding product error ${error}`);
    res.render("admin/add_products", {
      message: `  ${error}`,
      title: "Add product",
    });
  }
};

//get delete products
const getdeleteproducts = async (req, res) => {
  try {
    var slug = req.params.slug;
    var product = await ProductModel.findOne({ slug });
    if (!product.image) {
      await ProductModel.deleteOne({ slug });
      return res.redirect("back");
    }
    fs.remove("public/product_images/" + product.image, (err) => {
      if (err) {
        console.log("removing product image error", err);
      }
      //if file removed
      else {
        ProductModel.deleteOne({ slug }, (err, p) => {
          if (err) console.log(`Deleting product error ${err}`);
          else {
            return res.redirect("back");
          }
        });
      }
    });
  } catch (err) {
    console.log(`Deleting product error ${err}`);
  }
};

//get edit products
const geteditproducts = async (req, res) => {
  try {
    const { slug } = req.params;
    var product = await ProductModel.findOne({ slug });
    var category = await CatModel.find({});
    res.render("admin/edit_products", {
      title: "Edit Products",
      product: product,
      categories: category,
    });
  } catch (error) {
    console.log(`Editing Products error ${error}`);
  }
};

//post edit products
const posteditproducts = async (req, res) => {
  try {
    var { slug } = req.params;
    var { title } = req.body;
    var product = await ProductModel.findOne({ slug });
    var category = await CatModel.find({});

    //no image update
    if (!req.files) {
      console.log(req.body);
      const updater = await ProductModel.updateOne(
        { slug },
        { $set: req.body }
      );
      res.redirect("/admin/products");
    }
    //image update
    else {
      var { image } = req.files;
      const extension = image.name.split(".").pop();

      //image verification
      const imageext = ["jpg", "png", "jpeg"];
      //if other extensions
      if (imageext.indexOf(extension) == -1) {
        console.log("invalid format");

        res.render("admin/edit_products", {
          product: product,
          categories: category,
          message: " Must have Image with  format of .jpg,.png or .jpeg",
        });
      }
      //if valid extension
      else {
        //remove previous image if exists
        if (product.image) {
          fs.remove("public/product_images/" + product.image, (err) => {
            if (err) {
              console.log(err);
            }
            console.log("file removed");
          });
        }
        req.body.image = title + "." + extension;
        //update in Database
        const ab = await ProductModel.updateOne(
          { slug },
          { $set: req.body },
          { new: true }
        );
        product = await ProductModel.findOne({ slug });
        //add new image
        image.mv("public/product_images/" + product.image, (err) => {
          if (err) {
            console.log(`Adding Image error ${err}`);
          }
          console.log("Image Updated");
          req.flash("success", "product edited");
          res.redirect("/admin/products");
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.render("edit_products", {
      message: `server error ${error}`,
      title: "Edit Products",
    });
  }
};
//get switch stock status
const switchstock = async (req, res) => {
  try {
    const { slug } = req.params;
    const { action } = req.query;
    switch (action) {
      case "remove":
        await ProductModel.updateOne({ slug }, { stock: false });
        break;
      case "add":
        await ProductModel.updateOne({ slug }, { stock: true });
      default:
        console.log("unauthorized action");
        break;
    }
    res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};
//switching highlight
const highlight = async (req, res) => {
  try {
    const { slug } = req.params;
    const { action } = req.query;
    switch (action) {
      case "remove":
        await ProductModel.updateOne({ slug }, { highlight: false });
        break;
      case "add":
        await ProductModel.updateOne({ slug }, { highlight: true });
      default:
        console.log("unauthorized action");
        break;
    }
    res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};

//exporting control functions
module.exports = {
  products,
  getaddproducts,
  postaddproducts,
  getdeleteproducts,
  geteditproducts,
  posteditproducts,
  switchstock,
  highlight,
};
