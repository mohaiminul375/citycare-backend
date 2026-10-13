import { Router } from "express";
import { AuthController } from "./auth.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post("/register", AuthController.registerPatient);
router.post("/login", AuthController.loginUser);
router.get("/me", auth(UserRole.ADMIN, UserRole.CITIZEN), AuthController.getMe);
router.post("/refresh-token", AuthController.refreshToken);
// admin
router.get("/me", AuthController.AllUser
);
export const AuthRoutes = router;
