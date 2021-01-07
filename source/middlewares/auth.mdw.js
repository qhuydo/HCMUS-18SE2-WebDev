module.exports = {
  auth(req, res, next) {
    if (req.session.auth === false) {
      req.session.retUrl = req.originalUrl;
      return res.redirect('/account/login');
    }
    next();
  },

  authAdmin(req, res, next) {
    if (req.session.auth !== true || req.session.type !== "administrator") {
      req.session.retUrl = req.originalUrl;
      res.status(404);
      return res.render('error', {
        error_code: 404
      });
    }
    next();
  },
 
  authStudent(req, res, next) {
    if (req.session.auth !== true || req.session.type !== "student") {
      req.session.retUrl = req.originalUrl;
      res.status(404);
      return res.render('error', {
          error_code: 404
      });
  }
  next();
}
}