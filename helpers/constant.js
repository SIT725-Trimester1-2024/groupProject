const dotEnv = require('dotenv');
dotEnv.config();
module.exports = {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRATION: process.env.JWT_EXPIRATION,
  NODE_ENV: process.env.NODE_ENV,
};