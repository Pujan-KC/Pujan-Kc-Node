//Admin authentication
const auth = (req, res, next) => {
  if (req.session.user) {
    if (req.session.user[0].isadmin === true) {
      return next();
    } else {
      return res.render("index");
    }
  } else {
    return res.render("login", { message: "Hello" });
  }
};
module.exports = auth;
