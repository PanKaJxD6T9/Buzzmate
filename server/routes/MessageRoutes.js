import { Router } from "express";
import { addMessage, getAllMessages, addImageMessage, addAudioMessage, getInitialContacts } from "../controllers/MessageController.js ";
import multer from "multer";

const router = Router();

const uploadImage = multer({dest: "public/images"});
const uploadAudio = multer({dest: "public/recordings"});

router.post("/send-message", addMessage);
router.get("/get-messages/:from/:to", getAllMessages);
router.post("/add-image-message", uploadImage.single("image"), addImageMessage);
router.post("/add-audio-message", uploadAudio.single("audio"), addAudioMessage);
router.get("/get-initial-contacts/:from", getInitialContacts);

export default router;