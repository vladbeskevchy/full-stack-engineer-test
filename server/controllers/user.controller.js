import User from "../models/user.model.js";
import _ from "lodash";
import errorHandler from "./../helpers/dbErrorHandler.js";

const create = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: "An email with the same name already exists.",
      });
    }
    const user = new User({ email, password });
    await user.save();
    res.status(200).json({ message: "Registration was successful" });
  } catch (error) {
    res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const userByID = async (req, res, next, id) => {
  try {
    const user = await User.findById(id).exec();
    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    req.profile = user;
    next();
  } catch (err) {
    return res.status(400).json({
      error: "User not found",
    });
  }
};

const read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

const list = async (req, res) => {
  try {
    const users = await User.find().select("email updated created");
    return res.json(users);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const update = async (req, res, next) => {
  try {
    let user = req.profile;
    user = _.extend(user, req.body);
    user.updated = Date.now();
    await user.save();
    user.hashed_password = undefined;
    user.salt = undefined;
    res.json(user);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const remove = async (req, res, next) => {
  try {
    let user = req.profile;
    let deletedUser = await User.findByIdAndRemove(user._id);

    if (!deletedUser) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    deletedUser.hashed_password = undefined;
    deletedUser.salt = undefined;

    res.json(deletedUser);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

export default {
  create,
  userByID,
  read,
  list,
  remove,
  update,
};
