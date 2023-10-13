const { User } = require("./mongodb");
const jwt = require("jsonwebtoken");

const register = (req, res) => {
  const { firstname, lastname, email, hash } = req.body;
  console.log(req.body);
  try {
    const user = new User({
      firstname,
      lastname,
      email,
      hash,
    });
    user
      .save()
      .then(() => {
        res.json({
          email: user.email,
          message: `${user.email} erfolgreich gespeichert`,
        });
      })
      .catch((error) => {
        throw error;
      });
  } catch (error) {
    res.status(500).json({ error: { message: error } });
  }
};

const login = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(req.body);
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ error: { message: "Invalid credentials" } });
    const accessToken = jwt.sign({ email }, "token", { expiresIn: "2h" });

    console.log("finish");
    res.json({
      user: {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        hash: user.hash,
      },
      token: accessToken,
    });
  } catch (error) {
    return res.status(500).json({ error: { message: "error" } });
  }
};

module.exports = { register, login };
