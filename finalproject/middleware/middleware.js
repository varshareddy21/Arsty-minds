var connectionModel = require('../models/ConnectionSchema');
module.exports.checkOwnership = function(req,res,next) {
    if (req.isAuthenticated()) {
        connectionModel.connection.findById(req.params.id, function (err, connection) {
            if (err) {
                res.redirect("back");
            } else {
                // does user own the campground?
                if (connection.username === req.user.username) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    }
};


module.exports.isLoggedin = function(req,res,next)
{
        if(req.isAuthenticated()){
            return next();
        }
        res.redirect("/login");
}
