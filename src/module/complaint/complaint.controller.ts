import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { complaintService } from "./complaint.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createComplain = catchAsync(async (req: Request, res: Response) => {
	const payload = req.body;
	const result = await complaintService.createComplain(payload);
	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "create complain successfully",
		data: result,
	});
});

export const complaintController = {
	createComplain,
};
