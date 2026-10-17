import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { complaintService } from "./complaint.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import type { ComplaintStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

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

const getAllComplaintAdmin = catchAsync(async (req: Request, res: Response) => {
	const result = await complaintService.getAllComplaintAdminFromDB();
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "get all  successfully",
		data: result,
	});
});
const getAllComplaintMe = catchAsync(async (req: Request, res: Response) => {
	const result = await complaintService.getAllComplaintMeFromDB(
		req.params.id as string,
	);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "get my complaint  successfully",
		data: result,
	});
});
const getSingleComplaint = catchAsync(async (req: Request, res: Response) => {
	const result = await complaintService.getSingleComplaintFromDB(
		req.params.id as string,
	);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "get single complaint  successfully",
		data: result,
	});
});
const updateComplaint = catchAsync(async (req: Request, res: Response) => {
	const complaintId = req.params.id;
	const citizenId = req.user?.id;
	const payload = req.body;
	const result = await complaintService.updateComplaintFromDB(
		complaintId as string,
		citizenId as string,
		payload,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "complaint update  successfully",
		data: result,
	});
});
const updateComplaintStatus = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const { status } = req.body;

	const result = await complaintService.updateComplaintStatusFromDB(
		id as string,
		status as ComplaintStatus,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Complaint status updated successfully",
		data: result,
	});
},
);


const assignStaff = catchAsync(async (req: Request, res: Response) => {
	const complaintId = req.params.id;
	const payload = req.body
	const result = await complaintService.assignStaffFromDB(complaintId as string, payload);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Assign a staff successfully",
		data: result,
	});
})

export const complaintController = {
	createComplain,
	getAllComplaintAdmin,
	getAllComplaintMe,
	getSingleComplaint,
	updateComplaint,
	updateComplaintStatus,
	assignStaff
};
