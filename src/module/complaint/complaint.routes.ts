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

router.get(
	"/me/:id",
	auth(UserRole.CITIZEN),
	complaintController.getAllComplaintMe,
);
router.get(
	"/:id",
	auth(UserRole.ADMIN, UserRole.CITY_ADMIN, UserRole.CITIZEN),
	complaintController.getSingleComplaint,
);
router.patch(
	"/update/:id",
	auth(UserRole.CITIZEN),
	complaintController.updateComplaint,
);
// admin
router.get(
	"/",
	auth(UserRole.ADMIN, UserRole.CITY_ADMIN),
	complaintController.getAllComplaintAdmin,
);
router.patch(
	"/updateStatus/:id",
	auth(UserRole.ADMIN),
	complaintController.updateComplaintStatus,
);

router.patch('/assignStaff/:id', complaintController.assignStaff)
export const complaintRoutes = router;
