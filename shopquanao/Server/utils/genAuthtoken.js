const jwt = require("jsonwebtoken");

const generateAuthToken = (user) => {
  const jwtSecretKey = "shopquanao123456";
  const token = jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    jwtSecretKey
  );

  return token;
};

module.exports = generateAuthToken;