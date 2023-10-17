const { passwordCompare, passwordHash } = require("./hashPasswort");
const { User } = require("./mongodb");
const jwt = require("jsonwebtoken");

const register = (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  const hash = passwordHash(password);
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
        if (error.code === 11000 || error.code === 11001) {
          return res.status(409).json({
            error: {
              message: `Email ${email} schon belegt. Bitte Email ändern.`,
            },
          });
        } else {
          throw error;
        }
      });
  } catch (error) {
    res.status(500).json({ error: { message: error } });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ error: { message: "Invalid credentials" } });

    const match = passwordCompare(password, user.hash);
    if (!match) {
      return res
        .status(500)
        .json({ error: { message: "Email or password is invalid" } });
    }

    const accessToken = jwt.sign({ email }, "token", { expiresIn: "2h" });

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
