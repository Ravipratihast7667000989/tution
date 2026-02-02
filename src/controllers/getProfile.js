const User = require('../model/usermodels.js');

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      firstname: user.firstname,
      lastname:user.lastname,
      phoneNumber:user.phoneNumber,
      email: user.email,
      image: user.image
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProfile };
