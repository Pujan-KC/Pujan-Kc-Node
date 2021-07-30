require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const fileUpload = require("express-fileupload");
const PORT = process.env.PORT || 5000;

//defining routes
const product_router = require("./routes/admin_products");
const category_router = require("./routes/admin_category");
const pages_router = require("./routes/admin_pages");
const admin = require("./routes/admin");
const sliderouter = require("./routes/admin_slides");
const cart = require("./routes/cart");
const users = require("./routes/users");
const router = require("./routes/router");

const view_path = path.join(__dirname, "../templates/views");
const partial_path = path.join(__dirname, "../templates/partials");
const hbs = require("hbs");
const static_path = path.join(__dirname, "../public");

// const connect_flash = require("connect-flash")
const flash = require("req-flash");
require("./db/conn");
app.set("view engine", "hbs");
app.set("views", view_path);
hbs.registerPartials(partial_path);

app.use(express.static(static_path));

//express session middleware
app.use(
  session({
    name: "cart session",
    resave: false,
    saveUninitialized: true,
    secret: "keyboard cat",
    cookie: { maxAge: 4600000, sameSite: true },
  })
);

//set golbal eroors variable
app.locals.errors = null;

//express file upload middleware
app.use(fileUpload());

//handling body parser by urlencoded method
app.use(express.urlencoded({ extended: false }));
//parse application/json
app.use(express.json());

// express messages middleware
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

app.get("*", (req, res, next) => {
  res.locals.cart = req.session.cart;
  res.locals.user = req.session.user || null;
  next();
});

//checking admin authentication
const auth = require("../controller/admin_auth");

//setting routes
app.use("/admin/categories", auth, category_router);
app.use("/admin/products", auth, product_router);
app.use("/admin/pages", auth, pages_router);
app.use("/admin/slides", auth, sliderouter);
app.use("/admin", auth, admin);
app.use("/users", users);
app.use("/cart", cart);
app.use("/", router);
app.use("*", (req, res) => {
  res.render("Error", { title: "ERROR 404" });
});

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
