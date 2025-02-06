import { Router } from "express";
import { addMessage, getAllMessages } from "../controllers/MessageController.js ";

const router = Router();

router.post("/send-message", addMessage);
router.get("/get-messages/:from/:to", getAllMessages);


export default router;