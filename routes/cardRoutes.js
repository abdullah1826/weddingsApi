import express from "express";
import {
  createCardController,
  getCardData,
  getCardDataByUserId,
} from "../controllers/CradController.js";
import userAuth from "../middlewares/auth.js";
import {
  deleteRsvp,
  getRsvpDataById,
  getRsvpDataByUserId,
  SubmitRsvpController,
} from "../controllers/rsvpController.js";

// router Object
const router = express.Router();

router.post("/createCard", userAuth, createCardController);
router.get("/getCardById", userAuth, getCardDataByUserId);
router.get("/getCard/:cardId", getCardData);
// rsvp
router.post("/submitRsvp", SubmitRsvpController);
router.get("/getRsvp", userAuth, getRsvpDataByUserId);
router.post("/deleteRsvp", deleteRsvp);
router.get("/getRsvpById/:id", getRsvpDataById);
// router.post("/googleAuth", GoogleAuthController);
// router.post("/forgetPassword", forgotPassword);
// router.post("/resetPassword", resetPassword);

export default router;
