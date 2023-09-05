const { User } = require("./mongodb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  console.log(req.body);
  try {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) throw err;

      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) throw err;
        const user = new User({
          firstname,
          lastname,
          email,
          password: hash,
          salt,
        });
        await user.save();
        res.json({
          email: user.email,
          message: `${user.email} erfolgreich gespeichert`,
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: { message: error } });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ error: { message: "Invalid credentials" } });

    console.log(user.salt);
    const match = await bcrypt.compare(password, user.password);
    console.log("match-->", match);
    if (!match)
      return res
        .status(401)
        .json({ error: { message: "Email or password is invalid" } });
    const accessToken = jwt.sign({ email }, "token", { expiresIn: "2h" });

    console.log("finish");
    res.json({
      user: {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      },
      token: accessToken,
    });
  } catch (error) {
    return res.status(500).json({ error: { message: "error" } });
  }
};

module.exports = { register, login };
