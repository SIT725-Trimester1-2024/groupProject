const dotenv = require('dotenv');
dotenv.config();

const isAdmin = (req, res, next) => {
    if (req.user.username !== process.env.ADMIN_USERNAME ) {
        console.log('Forbidden');
        console.log(req.user);
        console.log(process.env.ADMIN_USERNAME);
        req.flash('error', 'Forbidden');
        res.status(401).render('error');
        return;
    }
    next();
};

module.exports = isAdmin;
