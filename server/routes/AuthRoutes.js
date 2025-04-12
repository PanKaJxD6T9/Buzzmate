import {Router} from "express";
import { checkUser, onBoarding, getAllUsers, generateToken } from "../controllers/AuthController.js";

const router = Router();

router.post("/check-user", checkUser);
router.post("/onboarding", onBoarding);
router.get("/all-users", getAllUsers);
router.get("/generate-token/:userId", generateToken);


export default router;