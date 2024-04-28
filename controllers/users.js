const User = require("../models/user");

module.exports.registrationForm = (req, res) => {
  res.render("users/register");
};

module.exports.createRegistration = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    if (req.body.adminCode === "secret") {
      user.isAdmin = true;
    }
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to QHCP!");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};

module.exports.renderLogin = (req, res) => {
  if (req.query.returnTo) {
    req.session.returnTo = req.query.returnTo;
  }
  res.render("users/login");
};

module.exports.makeLogin = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
  req.logout();
  // req.session.destroy();
  req.flash("success", "Goodbye!");
  res.redirect("/");
};
