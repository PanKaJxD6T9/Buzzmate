import {Router} from "express";
import { checkUser, onBoarding } from "../controllers/AuthController.js";

const router = Router();

router.post("/check-user", checkUser);
router.post("/onboarding", onBoarding);

export default router;