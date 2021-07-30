const { removeSync } = require("fs-extra");
var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    trim: true,
    unique: [true, "Email already in use"],
  },
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    maxlength: 10,
  },
  admin: { type: Boolean, default: false },
  password: { type: String, required: true, trim: true, minLength: 6 },
  wishlist: [
    {
      product: {
        type: String,
      },
      qty: { type: Number },
    },
  ],
});

// Adding to wihslist
userSchema.methods.Addwishlist = async function (item, value) {
  try {
    var newitem = true;
    var userWishlist = this.wishlist;
    //if wishlist exists
    if (userWishlist.length) {
      for (var i = 0; i < userWishlist.length; i++) {
        //if product exists in wishlist
        if (userWishlist[i].product == item) {
          this.wishlist[i].qty += value;
          await this.save();
          newitem = false;
        }
      }
    }
    //if new item is being added
    if (newitem == true) {
      this.wishlist = this.wishlist.concat({ product: item, qty: value });
      await this.save();
    }
    return item;
  } catch (error) {
    console.log(`Adding to wishlist error ${error}`);
  }
};

//updating wishlist
userSchema.methods.updatewishlist = async function (item, i, action) {
  if (action == "remove") {
    this.wishlist[i].qty--;
    if (this.wishlist[i].qty < 1) this.wishlist.splice(i, 1);
  }
  if (action == "clear") {
    this.wishlist.splice(i, 1);
  }
  await this.save();
};

var UserModel = (module.exports = new mongoose.model("User", userSchema));
