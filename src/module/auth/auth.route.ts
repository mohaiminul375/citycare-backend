import { Router } from "express";
import { AuthController } from "./auth.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { userValidationZod } from "./auth.validation";
import { validateRequestZod } from "../../middleware/validateRequestZod";

const router = Router();

router.post("/register", validateRequestZod(userValidationZod.userRegistrationZodSchema), AuthController.registerUser);
router.post("/login", validateRequestZod(userValidationZod.userLoginZodSchema), AuthController.loginUser);
router.post("/google", AuthController.googleLogin);
router.get("/me", auth(UserRole.ADMIN, UserRole.CITIZEN), AuthController.getMe);
router.post("/refresh-token", AuthController.refreshToken);
// admin
router.get("/all-user", auth(UserRole.ADMIN), AuthController.AllUser);
router.patch("/role/:id",
    auth(UserRole.ADMIN),
    validateRequestZod(userValidationZod.roleValidationZodSchema),
    AuthController.updateRole);
router.patch("/block/:id",
    auth(UserRole.ADMIN), 
    validateRequestZod(userValidationZod.userStatusValidationZodSchema),
    AuthController.blockUser);
export const AuthRoutes = router;
