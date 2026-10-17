import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { paymentService } from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createPaymentAndUpdateStatus = catchAsync(
	async (req: Request, res: Response) => {
		const { complaintId } = req.body;
		const citizenId = req.user?.id;
		const result = await paymentService.createPaymentAndUpdateStatusToDB(
			complaintId as string,
			citizenId as string,
		);

		sendResponse(res, {
			statusCode: httpStatus.OK,
			success: true,
			message: "payment create successfully",
			data: result,
		});
	},
);
const paymentCallBack = catchAsync(async (req: Request, res: Response) => {
	console.log(req.query, "req.query");
	const { executedPaymentResult, redirectUrl } =
		await paymentService.paymentCallback(req.query);

	console.log({ executedPaymentResult }, "callback controller");
	console.log(redirectUrl, "redirect url");
	res.redirect(redirectUrl);
});

export const paymentController = {
	createPaymentAndUpdateStatus,
	paymentCallBack,
};
