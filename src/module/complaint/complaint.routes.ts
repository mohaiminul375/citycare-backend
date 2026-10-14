import { Router } from "express";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { complaintController } from "./complaint.controller";
import { validateRequestZod } from "../../middleware/validateRequestZod";
import { complaintValidationZod } from "./complaint.validation";

const router = Router();
router.post(
	"/",
	auth(UserRole.CITIZEN),
	validateRequestZod(complaintValidationZod.createComplainValidation),
	complaintController.createComplain,
);
export const complaintRoutes = router;
