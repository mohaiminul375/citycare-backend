import type { ComplaintStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import type { ICreateComplaint } from "./complaint.interface";

const createComplain = async (payload: ICreateComplaint) => {
	const result = await prisma.complaint.create({ data: payload });
	return result;
};

const getAllComplaintAdminFromDB = async () => {
	const result = await prisma.complaint.findMany({
		include: {
			staff: true,
			citizen: {
				omit: {
					password: true,
				},
			},
			category: true,
		},
	});
	return result;
};
const getAllComplaintMeFromDB = async (citizenId: string) => {
	const result = await prisma.complaint.findMany({
		where: {
			citizenId: citizenId,
		},
		include: {
			staff: true,
			category: true,
		},
	});
	return result;
};
const getSingleComplaintFromDB = async (id: string) => {
	const result = await prisma.complaint.findUniqueOrThrow({
		where: {
			id: id,
		},
		include: {
			staff: true,
			category: true,
			citizen: true,
		},
	});
	return result;
};

const updateComplaintFromDB = async (
	complaintId: string,
	citizenId: string,
	payload: ICreateComplaint,
) => {
	const result = await prisma.complaint.update({
		where: {
			id: complaintId,
			citizenId: citizenId,
			status: "PENDING",
		},
		data: payload,
	});

	return result;
};
const statusFlow: Record<ComplaintStatus, ComplaintStatus[]> = {
	PENDING: ["APPROVED", "REJECTED"],
	APPROVED: ["WAITING_FOR_STAFF"],
	WAITING_FOR_STAFF: ["ASSIGNED"],
	ASSIGNED: ["IN_PROGRESS"],
	IN_PROGRESS: ["RESOLVED"],
	RESOLVED: [],
	REJECTED: [],
};

// 2. Status update function
const updateComplaintStatusFromDB = async (
	complaintId: string,
	newStatus: ComplaintStatus,
) => {
	const complaint = await prisma.complaint.findUnique({
		where: { id: complaintId },
	});

	if (!complaint) {
		throw new Error("Complaint not found");
	}

	const allowedStatuses = statusFlow[complaint.status];

	if (!allowedStatuses.includes(newStatus)) {
		throw new Error(
			`Cannot change status from ${complaint.status} to ${newStatus}`,
		);
	}

	return prisma.complaint.update({
		where: { id: complaintId },
		data: { status: newStatus },
	});
};

export const complaintService = {
	createComplain,
	getAllComplaintAdminFromDB,
	getAllComplaintMeFromDB,
	getSingleComplaintFromDB,
	updateComplaintFromDB,
	updateComplaintStatusFromDB,
};
