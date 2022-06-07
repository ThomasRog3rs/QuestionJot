//This is code to protect routes when users are not logged in
module.exports = {
  ensureAuthenticated: function(req, res, next){
    if(req.isAuthenticated()){
      return next(); // if the user is logged in call the next bit of middleware
    }
    //if the user is not logged in tell them they are not authenticated.
    req.flash('error_msg', 'Not Authorised');
    res.redirect('/users/login');
  }
}