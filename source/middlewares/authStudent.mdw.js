module.exports = function auth(req, res, next) {
    if (req.session.auth !== true || req.session.type !== "student") {
      req.session.retUrl = req.originalUrl;
      res.status(404);
      return res.render('error', {
          error_code: 404
      });
  }
  next();
}