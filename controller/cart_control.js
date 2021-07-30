const { parse } = require("dotenv");
const ProductModel = require("../src/models/product");
const UserModel = require("../src/models/users");

// adding to cart with session
const addtocart = async (req, res) => {
  try {
    var { slug } = req.params;
    var value = 1;
    //if cart is being added from wishlist
    if (req.query.qty) {
      value = parseInt(req.query.qty, 10);
    }
    const product = await ProductModel.findOne({ slug });

    //defining new session if undefined
    if (typeof req.session.cart == "undefined") {
      req.session.cart = [];
      req.session.cart.push({
        title: product.title,
        slug: product.slug,
        qty: value,
        price: parseFloat(product.price).toFixed(2),
        image: product.image,
      });
    }
    // if session is defined
    else {
      var cart = req.session.cart;
      var newItemis = true;
      for (var i = 0; i < cart.length; i++) {
        //if item already exists
        if (cart[i].title == product.title) {
          cart[i].qty += value;
          newItemis = false;
          break;
        }
      }
      //if new item is being added to cart
      if (newItemis === true) {
        cart.push({
          title: product.title,
          slug: product.slug,
          qty: value,
          price: parseFloat(product.price).toFixed(2),
          image: product.image,
        });
      }
    }
    res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};

//get checkout page
const checkout = async (req, res) => {
  try {
    cart = req.session.cart;
    var products = [];
    var qty = null;
    const username = req.session.user[0].user;
    const userdata = await UserModel.findOne({ username });
    const wishlists = userdata.wishlist;
    if (wishlists.length) {
      for (var i = 0; i < wishlists.length; i++) {
        var slug = wishlists[i].product;
        qty = wishlists[i].qty;
        var wished_product = await ProductModel.findOne({ slug });
        products.push({ wished_product, qty });
      }
    } else {
      products = null;
    }
    res.render("checkout", {
      title: "Checkout",
      cart: cart,
      wishlists: wishlists,
      userdata: userdata,
      products: products,
    });
  } catch (error) {
    console.log(`Diplaying checkout page error ${error}`);
  }
};

//updating cart
const updatecart = async (req, res) => {
  try {
    var { product } = req.params;
    var cart = req.session.cart;
    var action = req.query.action;
    cartlength = cart.length;
    for (var i = 0; i < cart.length; i++) {
      console.log("looping");
      if (cart[i].title === product) {
        console.log("hello", cart[i].title);
        switch (action) {
          case "add":
            cart[i].qty++;
            break;
          case "remove":
            cart[i].qty--;
            if (cart[i].qty < 1) cart.splice(i, 1);
            break;
          case "clear":
            cart.splice(i, 1);
            if (cart.length == 0) delete req.session.cart;
            break;
          default:
            console.log("Cart update problem");
            break;
        }
        break;
      }
    }
    req.flash("success", "cart updated");
    res.redirect("/cart/checkout");
  } catch (error) {
    console.log(`updating cart error ${error}`);
  }
};
//clear cart
const clearcart = (req, res) => {
  delete req.session.cart;
  req.flash("success", "cart cleared");
  res.redirect("/cart/checkout");
};

module.exports = { addtocart, checkout, updatecart, clearcart };
