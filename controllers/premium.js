const User = require("../models/User");

const showLeaderBoard = async (req, res, next) => {
  try {
    const allExp = await User.find().sort({ totalExp: -1 });
    return res.status(201).json({ allExp });
  } catch (err) {
    res.status(500).json({ err });
  }
};

module.exports = {
  showLeaderBoard,
};
