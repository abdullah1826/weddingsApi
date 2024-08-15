import mongoose from "mongoose";
import cardModel from "../models/cardModel.js";
import userModel from "../models/userModel.js";

export let createCardController = async (req, res, next) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).send({ status: false, msg: "Unautherized!" });
    }
    if (!req.body.brideName) {
      return res
        .status(400)
        .send({ status: false, msg: "Bride name is required" });
    }
    if (!req.body.groomName) {
      return res
        .status(400)
        .send({ status: false, msg: "Groom name is required" });
    }

    if (req.body._id) {
      const { _id, ...updatedBody } = req.body;
      await cardModel.findByIdAndUpdate(_id, { ...updatedBody });

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
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: false,
      msg: "Something went wrong",
      error,
    });
  }
};

export const getCardData = async (req, res, next) => {
  const cardId = req.params.cardId;
  // console.log(req.params.cardId);
  // if (!cardId) {
  //   return res.status(400).send({ status: false, msg: "card id is required" });
  // }
  const objectId = new mongoose.Types.ObjectId(cardId);

  const card = await cardModel.findOne({ _id: objectId });

  if (!card) {
    return res.status(404).send({ status: false, msg: "Card not found" });
  }

  return res.status(200).send({
    status: true,
    data: card,
  });
};

export const getCardDataByUserId = async (req, res, next) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).send({ status: false, msg: "Unautherized!" });
  }

  const user = await userModel.findById(userId);
  if (!user) {
    return res.status(404).send({ status: false, msg: "User not found" });
  }
  const card = await cardModel.findOne({ userId: userId });

  if (!card) {
    return res.status(404).send({ status: false, msg: "Card not found" });
  }

  return res.status(200).send({
    status: true,
    data: card,
  });
};
