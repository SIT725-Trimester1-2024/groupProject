const isAdmin = (req, res, next) => {
    if (req.user.username !== process.env.ADMIN_USERNAME) {
        req.flash('error', 'Forbidden');
        res.status(401).render('error');
        return;
    }
    next();
};

module.exports = isAdmin;
