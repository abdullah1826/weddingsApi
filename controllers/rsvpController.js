import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import rsvpModel from "../models/rsvpModel.js";
import userModel from "../models/userModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import cardModel from "../models/cardModel.js";

export let SubmitRsvpController = catchAsyncError(async (req, res, next) => {
  const crntDate = Date.now();
  if (!req.body.fName) {
    return next(new ErrorHandler("First name is required", 400));
  }

  if (!req.body.phone && !req.body.mail) {
    return next(new ErrorHandler("Contact details are required", 400));
  }
  if (!req.body.numberOfGuests) {
    return next(new ErrorHandler("Please select number of guests", 400));
  }

  if (!req.body.AttendingStatus) {
    return next(
      new ErrorHandler(
        "Please select whether you will be attending or not",
        400
      )
    );
  }

  if (req.body._id) {
    const { _id, ...updatedBody } = req.body;
    await rsvpModel.findByIdAndUpdate(_id, { ...updatedBody });

    return res
      .status(200)
      .send({ status: true, msg: "Information updated successfuly" });
  }

  let newRsvp = await rsvpModel.create({
    guestId: crntDate,
    userId: req.body.userId,
    fName: req.body.fName,
    lastName: req.body?.lastName,
    mail: req.body?.mail,
    phone: req.body?.phone,
    numberOfGuests: req.body.numberOfGuests,
    AttendingStatus: req.body?.AttendingStatus,
    numberOfChilds: req.body?.numberOfChilds,
  });

  if (req.body.numberOfGuests === 2) {
    if (!req.body.fName2) {
      return next(
        new ErrorHandler("Second person's First name is required", 400)
      );
    }

    if (!req.body.phone2 && !req.body.mail2) {
      return next(
        new ErrorHandler("Second person's Contact details are required", 400)
      );
    }

    let newRsvp2 = await rsvpModel.create({
      guestId: newRsvp?.guestId,
      userId: req.body.userId,
      fName: req.body.fName2,
      lastName: req.body?.lastName2,
      mail: req.body?.mail2,
      phone: req.body?.phone,
      numberOfGuests: 1,
      AttendingStatus: req.body.AttendingStatus,
    });
  }

  return res.status(200).send({ status: true, msg: "Submited successfuly" });
});

export const getRsvpDataByUserId = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  if (!userId) {
    return next(new ErrorHandler("Unautherized!", 401));
  }

  const user = await userModel.findById(userId);
  if (!user) {
    next(new ErrorHandler("User not found", 404));
  }
  const data = await rsvpModel.find({ userId: userId });

  if (!data) {
    next(new ErrorHandler("No data found", 404));
  }

  return res.status(200).send({
    status: true,
    data: data,
  });
});

export const deleteRsvp = catchAsyncError(async (req, res, next) => {
  const { ids } = req.body; // Expecting an array of IDs in the request body

  if (!ids || !Array.isArray(ids)) {
    return next(
      new ErrorHandler("Invalid input, expected an array of IDs", 400)
    );
  }

  // Delete records with matching IDs
  const result = await rsvpModel.deleteMany({ _id: { $in: ids } });

  return res.status(200).send({
    status: true,
    msg: "Deleted successfully",
  });
});

export const getRsvpDataById = catchAsyncError(async (req, res, next) => {
  const userId = req.params.id;

  if (!userId) {
    return res
      .status(400)
      .send({ status: false, message: "rsvp id is required" });
  }

  const rsvp = await rsvpModel.findById(userId);

  if (!rsvp) {
    next(new ErrorHandler("rsvp not found", 404));
    // return res.status(400).send({ status: false, message: "rsvp not found" });
  }

  const card = await cardModel.findOne({ userId: rsvp?.userId });

  if (!card) {
    next(new ErrorHandler("event not found", 404));
    // return res.status(404).send({ status: false, message: "event not found" });
  }

  return res.status(200).send({
    status: true,
    data: {
      fName: rsvp?.fName,
      lName: rsvp?.lastName,
      email: rsvp?.mail,
      phone: rsvp?.phone,
      bgImg: card?.headerImage,
      status: rsvp?.AttendingStatus,
      guest: rsvp?.numberOfGuests,
      date: card?.eventDate,
      eventId: card?._id,
      website: `https://card.thewelcomepass.com/${card?._id}`,
      time: card?.time || "",
      groom_bride: `${card?.groomName} & ${card?.brideName}`,
      location: card?.location,
      rsvp,
    },
  });
});
