import { Router } from "express";
import { addMessage, getAllMessages, addImageMessage } from "../controllers/MessageController.js ";
import multer from "multer";

const router = Router();

const uploadImage = multer({dest: "public/images"});

router.post("/send-message", addMessage);
router.get("/get-messages/:from/:to", getAllMessages);
router.post("/add-image-message", uploadImage.single("image"), addImageMessage);

export default router;