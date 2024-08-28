import mongoose from "mongoose";

let rsvpModel = new mongoose.Schema({
  userId: {
    type: String,
  },
  fName: {
    type: String,
    unique: false,
  },
  lastName: {
    type: String,
  },
  mail: {
    type: String,
    unique: false,
  },
  phone: {
    type: String,
  },
  numberOfGuests: {
    type: Number,
  },
  AttendingStatus: {
    type: String,
  },
  numberOfChilds: {
    type: Number,
    default: 0,
  },
  guestId: {
    type: String,
  },
});

export default mongoose.model("Rsvp", rsvpModel);
