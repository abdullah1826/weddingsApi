import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import rsvpModel from "../models/rsvpModel.js";
import userModel from "../models/userModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export let SubmitRsvpController = catchAsyncError(async (req, res, next) => {
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
    ...req.body,
  });

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
