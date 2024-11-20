const { UserModel } = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { logger } = require("../helpers/logger");

async function userRegistration(req, res, next) {
  const { name, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 8);

    const user = new UserModel({ name, email, password: hash });
    await user.save();

    res.status(201).send({ message: " User registered successfully" });
  } catch (err) {
    logger.error(err.message);
    res.status(500).send({ message: "Internal server error" });
  }
}

async function userLogin(req, res, next) {
  const { email, password } = req.body;
  try {
    const isPresent = await UserModel.findOne({ email: email });

    if (!isPresent) {
      res.status(400).send({ message: "Wrong credentials" });
    }

    const compared = await bcrypt.compare(password, isPresent.password);

    if (compared) {
      const token = jwt.sign(
        { name: isPresent.name, email: isPresent.email, _id: isPresent._id },
        "secret"
      );

      res.status(200).send({ message: "Logged in successfully", token: token });
    } else {
      res.status(400).send({ message: "Wrong credentials" });
    }
  } catch (err) {
    logger.error(err.message);
    res.status(500).send({ message: "Internal server error" });
  }
}

async function updateUserRole(req, res, next) {
  const id = req.params.id;
  const { role } = req.body;

  try {
    const isPresent = await UserModel.findById(id);

    if (!isPresent) {
      res.status(404).send({ message: "No User found" });
    }

    await UserModel.findByIdAndUpdate({ _id: id }, { role: role });

    res.status(200).send({ message: "User role updated successfully" });
  } catch (err) {
    logger.error(err.message);
    res.status(500).send({ message: "Internal server error" });
  }
}

module.exports = { userRegistration, userLogin, updateUserRole };

// how to incorporat security while registering and loggin in? confirmation id while form submition?
