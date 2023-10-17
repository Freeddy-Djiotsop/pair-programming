const bcrypt = require("bcryptjs");

const passwordHash = (pwd) => {
  return bcrypt.hashSync(pwd, 10);
};

const passwordCompare = (pwd, hash) => {
  return bcrypt.compareSync(pwd, hash);
};

module.exports = { passwordHash, passwordCompare };
