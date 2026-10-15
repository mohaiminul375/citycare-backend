import { Router } from "express";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { paymentController } from "./payment.controller";

const router = Router();
router.post('/create', auth(UserRole.CITIZEN), paymentController.createPaymentAndUpdateStatus)
router.get('/callback', paymentController.paymentCallBack)
export const paymentRoutes = router;