import {Router} from "express";
import { checkUser, onBoarding, getAllUsers } from "../controllers/AuthController.js";

const router = Router();

router.post("/check-user", checkUser);
router.post("/onboarding", onBoarding);
router.get("/all-users", getAllUsers);


export default router;