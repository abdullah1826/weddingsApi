import mongoose from "mongoose";
import cardModel from "../models/cardModel.js";
import userModel from "../models/userModel.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
// import { emitEvent } from "../sockets.js";

export let createCardController = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  if (!userId) {
    return next(new ErrorHandler("Unautherized!", 401));
  }
  if (!req.body.brideName) {
    return next(new ErrorHandler("Bride name is required", 400));
  }
  if (!req.body.groomName) {
    return next(new ErrorHandler("Groom name is required", 400));
  }

  if (req.body._id) {
    const { _id, ...updatedBody } = req.body;
    const updatedCard = await cardModel.findByIdAndUpdate(_id, {
      ...updatedBody,
    });
    // emitEvent("updatedCard", updatedCard);
    return res
      .status(200)
      .send({ status: true, msg: "Card updated successfuly" });
  }

  let newCard = await cardModel.create({
    ...req.body,
    userId,
  });

  return res
    .status(200)
    .send({ status: true, msg: "Card created successfuly" });
});

export const getCardData = catchAsyncError(async (req, res, next) => {
  const cardId = req.params.cardId;
  // console.log(req.params.cardId);
  if (!cardId) {
    next(new ErrorHandler("card id is required", 400));
  }
  const objectId = new mongoose.Types.ObjectId(cardId);

  const card = await cardModel.findOne({ _id: objectId });

  if (!card) {
    next(new ErrorHandler("Card not found", 404));
  }

  return res.status(200).send({
    status: true,
    data: card,
  });
});

export const getCardDataByUserId = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  if (!userId) {
    next(new ErrorHandler("Unautherized!", 401));
  }

  const user = await userModel.findById(userId);
  if (!user) {
    next(new ErrorHandler("User not found", 404));
  }
  const card = await cardModel.findOne({ userId: userId });

  if (!card) {
    next(new ErrorHandler("Card not found", 404));
  }

  return res.status(200).send({
    status: true,
    data: card,
  });
});
