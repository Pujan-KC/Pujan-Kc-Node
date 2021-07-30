const bcrypt = require("bcryptjs");
var UserModel = require("../src/models/users");

//get register
const get_register = (req, res) => {
  res.render("register", { title: "Register" });
};
//post register
const post_register = async (req, res) => {
  try {
    const { password, confirmpassword } = req.body;
    if (password === confirmpassword) {
      req.body.admin = 0;
      const ab = new UserModel(req.body);
      hashedPassword = await bcrypt.hash(password, 10);
      ab.password = hashedPassword;
      const inserter = await ab.save();
      res.render("register", { message: "You are now registered" });
    } else {
      req.flash("info", "Passwords Donont Match");
      res.render("register", { message: "Passwords Donot match" });
    }
  } catch (error) {
    console.log(`Registering user error ${error}`);
    res.render("register", { message: error });
  }
};
//get login
const get_login = (req, res) => {
  res.render("login", { title: "Log In" });
};
//post login
const post_login = async (req, res) => {
  var message = null;
  try {
    const { password, username } = req.body;

    const userdata = await UserModel.findOne({ username });
    //if user exists
    if (userdata) {
      passwordcheck = await bcrypt.compare(password, userdata.password);
      //if password is correct
      if (passwordcheck) {
        //create a session

        if (userdata.admin === true) {
          req.session.user = [{ user: userdata.username, isadmin: true }];
          return res.render("admin/admin_index");
        }
        req.session.user = [{ user: userdata.username }];
        return res.redirect("/");
      }
      //if passowrd is incorrect
      else {
        console.log("incorrect password");
        message = "invalid user name / password";
      }
    }
    //if user donot exists
    else {
      console.log("Username donot match");
      message = "invalid user name / Password";
    }
    res.render("login", { message: message });
  } catch (error) {
    console.log(` Loggin in error ${error}`);
  }
};
//logout
const logout = (req, res) => {
  delete req.session.cart;
  delete req.session.user;
  req.flash("success", "You are now logged out");
  res.redirect("back");
};
//add to wishlist
const add_wishlist = async (req, res) => {
  try {
    //if cart item is being added to wihslist remove item from cart
    const { item, qty } = req.query;
    var value = 1;
    console.log(qty);
    if (req.query.item) {
      value = parseInt(qty, 10);
      console.log("cart to wishlist");
      const cart = req.session.cart;
      for (var i = 0; i < cart.length; i++) {
        if (cart[i].title == item) {
          req.session.cart.splice(i, 1);
        }
      }
    }
    const { slug } = req.params;
    username = req.session.user[0].user;
    var User = await UserModel.findOne({ username });
    const listing = await User.Addwishlist(slug, value);
    res.redirect("back");
  } catch (error) {
    console.log("Adding to wishlist error", error);
  }
};
//updating wishlist
const update_wishlist = async (req, res) => {
  try {
    const { slug } = req.params;
    const { action } = req.query;
    const username = req.session.user[0].user;
    const userdata = await UserModel.findOne({ username });
    var userwishlist = userdata.wishlist;
    for (var i = 0; i < userwishlist.length; i++) {
      if (userwishlist[i].product === slug) {
        switch (action) {
          case "remove":
            console.log("remove");
            const update = await userdata.updatewishlist(slug, i, action);
            res.redirect("back");
            break;
          case "add":
            console.log("add");
            await userdata.Addwishlist(slug, 1);
            res.redirect("back");
            break;
          case "clear":
            console.log("clear");
            await userdata.updatewishlist(slug, i, action);
            res.redirect("back");
            break;
          default:
            console.log("unidentified action");
            break;
        }
      }
    }
  } catch (error) {
    console.log("Updating wishlist product", error);
  }
};
//clearing wishlist
const clear_wishlist = async (req, res) => {
  try {
    const username = req.session.user[0].user;
    const delete_product = await UserModel.updateOne(
      { username },
      { $unset: { wishlist: 1 } }
    );
    res.redirect("back");
  } catch (error) {
    console.log(`Updating wihslist error ${error}`);
  }
};

module.exports = {
  get_login,
  get_register,
  post_register,
  post_login,
  logout,
  add_wishlist,
  update_wishlist,
  clear_wishlist,
};
