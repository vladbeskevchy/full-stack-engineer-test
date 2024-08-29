import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import expressJwt from "express-jwt";
import dotenv from "dotenv";
dotenv.config();

const signin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({
        error: "User not found",
      });
    }
    if (!user.authenticate(req.body.password)) {
      return res.status(401).send({
        error: "Email and password don't match.",
      });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.cookie("t", token, {
      expire: new Date(Date.now() + 9999 * 1000), // Setting expiration time in milliseconds
    });

    return res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

const signout = (req, res) => {
  res.clearCookie("t");
  return res.status(200).json({
    message: "signed out",
  });
};

const requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: "auth",
});

const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!authorized) {
    return res.status("403").json({
      error: "User is not authorized",
    });
  }
  next();
};

export default {
  signin,
  signout,
  requireSignin,
  hasAuthorization,
};
