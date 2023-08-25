const mongoose = require("mongoose");
const db = "mongodb://127.0.0.1:27017/ppa";

mongoose
  .connect(db)
  .then(() => console.log("DB ist Connect"))
  .catch((err) => console.error(err));

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
});
const User = new mongoose.model("User", userSchema);

module.exports = { User };
