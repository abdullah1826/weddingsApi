import rsvpModel from "../models/rsvpModel.js";
import userModel from "../models/userModel.js";

export let SubmitRsvpController = async (req, res, next) => {
  try {
    if (!req.body.fName) {
      return res
        .status(401)
        .send({ status: false, msg: "First name is required" });
    }

    if (!req.body.phone && !req.body.mail) {
      return res
        .status(400)
        .send({ status: false, msg: "Contact details are required" });
    }
    if (!req.body.numberOfGuests) {
      return res
        .status(400)
        .send({ status: false, msg: "Please select number of guests" });
    }

    if (!req.body.AttendingStatus) {
      return res.status(400).send({
        status: false,
        msg: "Please select whether you will be attending or not",
      });
    }

    if (req.body._id) {
      const { _id, ...updatedBody } = req.body;
      await rsvpModel.findByIdAndUpdate(_id, { ...updatedBody });

      return res
        .status(200)
        .send({ status: true, msg: "Information updated successfuly" });
    }

    let newRsvp = await rsvpModel.create({
      ...req.body,
    });

    return res.status(200).send({ status: true, msg: "Submited successfuly" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: false,
      msg: "Something went wrong",
      error,
    });
  }
};

export const getRsvpDataByUserId = async (req, res, next) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).send({ status: false, msg: "Unautherized!" });
  }

  const user = await userModel.findById(userId);
  if (!user) {
    return res.status(404).send({ status: false, msg: "User not found" });
  }
  const data = await rsvpModel.find({ userId: userId });

  if (!data) {
    return res.status(404).send({ status: false, msg: "No data found" });
  }

  return res.status(200).send({
    status: true,
    data: data,
  });
};
