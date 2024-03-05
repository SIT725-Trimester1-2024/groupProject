const jsonwebtoken = require("jsonwebtoken");
const { JWT_SECRET } = require("../helpers/constant");
const db = require("./db");
function jwt(roles = []) {
  // roles param can be a single role string (e.g. Role.User or 'User')
  // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
  if (typeof roles === "string") {
    roles = [roles];
    console.log(roles);
  }
  const secret = JWT_SECRET;
  return [
    // authenticate JWT token and attach user to request object (req.user)
    (req, res, next) => {
     
      if (!req.headers.authorization) {
        return res.render('init');
      }
      const token = req.headers.authorization.split(" ")[1];
      jsonwebtoken.verify(token, secret, (err, user) => {
        if (err) {
          return res.status(401).json({ message: "Invalid token" });
        }
        req.user = user;
        next();
      });
    },

    // authorize based on user role
    async (req, res, next) => {
      const user = await db.User.findById(req.user.sub);

      if (!user || (roles.length && !roles.includes(user.role))) {
        // user's role is not authorized
        return res.status(401).json({ message: "Only Admin is Authorized!" });
      }
      // authentication and authorization successful
      req.user.role = user.role;
      next();
    },
  ];
}
module.exports = jwt;