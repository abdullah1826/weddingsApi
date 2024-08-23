import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";

const transporter = nodemailer.createTransport({
  port: 465, // true for 465, false for other ports

  host: "server15.hndservers.net",
  auth: {
    user: "zain@link2avicenna.com",
    pass: "Avicenna7860#",
  },
  secure: true,
});

export let SignupController = catchAsyncError(async (req, res, next) => {
  if (!req.body.email) {
    next(new ErrorHandler("Email field is required", 400));
  }
  if (!req.body.password) {
    next(new ErrorHandler("Password field is required", 400));
  }

  let userExist = await userModel.findOne({ email: req.body.email });

  if (userExist) {
    next(new ErrorHandler("This email is already registered", 400));
  }

  const salt = await bcrypt.genSalt(10);
  let bcryptpassword = await bcrypt.hash(req.body.password, salt);

  let newUser = await userModel.create({
    ...req.body,
    password: bcryptpassword,
  });

  return res
    .status(200)
    .send({ status: true, msg: "Account created successfuly" });
});

export let SigninController = catchAsyncError(async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    next(new ErrorHandler("All fields are required", 400));
  }

  let userExist = await userModel.findOne({ email: req.body.email });

  if (!userExist) {
    next(new ErrorHandler("User not found", 404));
  }

  let isMatch = bcrypt.compare(req.body.password, userExist.password);

  if (!isMatch) {
    next(new ErrorHandler("Wrong credentials!", 400));
  }

  let theToken = Jwt.sign({ userId: userExist._id }, "mySecret", {
    expiresIn: "1y",
  });

  return res.status(200).send({
    status: true,
    msg: "Login successfuly",
    token: theToken,
    user: userExist,
  });
});

export let GoogleAuthController = catchAsyncError(async (req, res, next) => {
  if (!req.body.email) {
    next(new ErrorHandler("Email field is required", 400));
  }
  let userExist = await userModel.findOne({ email: req.body.email });

  if (userExist) {
    const theToken = Jwt.sign({ userId: userExist._id }, "mySecret", {
      expiresIn: "1y",
    });
    return res.status(200).send({
      status: true,
      msg: "Authenticated by google successfuly",
      token: theToken,
      user: userExist,
    });
  }

  let newUser = await userModel.create({
    ...req.body,
    password: "not-require",
  });

  let theToken = Jwt.sign({ userId: newUser._id }, "mySecret", {
    expiresIn: "1y",
  });

  return res.status(200).send({
    status: true,
    msg: "Authenticated by google successfuly",
    token: theToken,
    user: newUser,
  });
});

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(401)
        .json({ status: false, message: "Email should not be empty" });
    }

    // Check if the user already exists
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // Send email with verification code
    const mailOptions = {
      from: "zain@link2avicenna.com",
      //   from: 'hasnain.avicennaenterprise@gmail.com',
      to: email,
      subject: "Sentiments-Vallet update password",
      // text: `Your verification code is: ${verificationCode}`,
      html: `
        <p>Hi [name],</p><br/>
        <p>There was a request to change your password!</p><br/>
        <p>If you did not make this request then please ignore this email.</p><br/>
        <p>Otherwise, please click this link to change your password: <a href=${`https://generator.globalqrcodes.com/dashboard/updatePassword/${existingUser?._id}`}>${`https://generator.globalqrcodes.com/dashboard/updatePassword/${existingUser?._id}`}</a></p>
    `,
    };

    transporter.sendMail(mailOptions, function (err, info) {
      console.log(info);
      if (err)
        return res.status(500).json({ status: false, message: err.message });
      else
        return res.status(200).json({
          status: true,
          message: "Email sent",
        });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: error.message });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { id, newPassword } = req.body;

    // Check if the user exists
    const user = await userModel.findOne({ _id: id });
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    let bcryptpassword = await bcrypt.hash(newPassword, salt);

    await userModel.updateOne({ _id: id }, { password: bcryptpassword });

    return res.json({ status: true, message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};
