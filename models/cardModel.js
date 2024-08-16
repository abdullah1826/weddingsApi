import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  time: { type: String, required: true },
  description: { type: String },
});

const eventSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  date: { type: String, default: "" },
  time: { type: String, default: "" },
  activities: [activitySchema],
});

const hotelSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  description: { type: String, default: "" },
});

const placeSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  description: { type: String, default: "" },
});

const faqSchema = new mongoose.Schema({
  question: { type: String, default: "" },
  answer: { type: String, default: "" },
});

const contactSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  number: { type: String, default: "" },
});

const bridalPersonsSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  image: { type: String, default: "" },
});

let cardModel = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  brideName: {
    type: String,
    default: "",
  },
  groomName: {
    type: String,
    default: "",
  },
  welcomeText: {
    type: String,
    default: "",
  },
  eventDate: {
    type: String,
    default: "",
  },
  location: {
    type: String,
    default: "",
  },
  headerImage: {
    type: String,
    default: "",
  },
  venueName: {
    type: String,
    default: "",
  },
  venueLocation: {
    type: String,
    default: "",
  },
  venueDescription: {
    type: String,
    default: "",
  },
  venueImages: {
    type: [String],
  },
  isAdmin: {
    type: Boolean,
    default: true,
  },
  itinerary: {
    event1: eventSchema,
    event2: eventSchema,
    event3: eventSchema,
    event4: eventSchema,
  },
  accomodation: {
    type: [hotelSchema],
  },
  accomodationBackground: {
    type: String,
  },

  placesWeLove: {
    type: [placeSchema],
  },
  placesBackground: {
    type: String,
  },
  faqs: {
    type: [faqSchema],
  },
  contacts: {
    type: [contactSchema],
  },
  bgColor: {
    type: String,
    default: "#ffffff",
  },
  font: {
    type: String,
    default: "montaga",
  },
  order: {
    type: [Number],
    default: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  },
  hidebanner: {
    type: Boolean,
    default: false,
  },
  hideVenue: {
    type: Boolean,
    default: false,
  },
  hideBridalParty: {
    type: Boolean,
    default: false,
  },
  hideAccomodation: {
    type: Boolean,
    default: false,
  },
  hidePlaces: {
    type: Boolean,
    default: false,
  },
  hideItinerary: {
    type: Boolean,
    default: false,
  },
  hideRsvp: {
    type: Boolean,
    default: false,
  },
  hidefaqs: {
    type: Boolean,
    default: false,
  },
  hideConactUs: {
    type: Boolean,
    default: false,
  },
  hideRegistry: {
    type: Boolean,
    default: false,
  },
  groomsMen: {
    type: [bridalPersonsSchema],
  },
  bridesMaids: {
    type: [bridalPersonsSchema],
  },
  bridalBgImg: {
    type: String,
  },
  itineraryBg: {
    type: String,
  },
  faqImage: {
    type: String,
  },
  contactBgImage: {
    type: String,
  },
  rsvpBgImage: {
    type: String,
  },
});

export default mongoose.model("Cards", cardModel);
