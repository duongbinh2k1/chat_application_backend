const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 6,
    max: 20,
    unique: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },

  password: {
    type: String,
    required: true,
  },

  // isAvatarImgSet: {
  //   type: Boolean,
  //   default: false,
  // },

  // avatarImg: {
  //   type: String,
  //   default: "",
  // },
});

userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.isCheckPassword = async function(password) {
  try {
    return await bcrypt.compare(password, this.password)
  } catch (error) {

  }
}

module.exports = mongoose.model("User", userSchema);
