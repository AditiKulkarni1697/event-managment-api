const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: (params) => `${params.value} is not a valid email address!`,
    },
  },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["participant", "event-manager"],
    default: "participant",
  },
});

const UserModel = mongoose.model("user", userSchema);

module.exports = { UserModel };
