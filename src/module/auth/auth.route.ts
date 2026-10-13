import { Router } from "express";
import { AuthController } from "./auth.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post("/register", AuthController.registerPatient);
router.post("/login", AuthController.loginUser);
router.post("/google", AuthController.googleLogin);
router.get("/me", auth(UserRole.ADMIN, UserRole.CITIZEN), AuthController.getMe);
router.post("/refresh-token", AuthController.refreshToken);
// admin
router.get("/all-user", auth(UserRole.ADMIN), AuthController.AllUser
);
router.patch("/role/:id", auth(UserRole.ADMIN), AuthController.updateRole);
router.patch('/block/:id', auth(UserRole.ADMIN), AuthController.blockUser);
export const AuthRoutes = router;
