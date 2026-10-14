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
					password: true
				}
			},
			category: true
		}
	});
	return result
}
const getAllComplaintMeFromDB = async (citizenId: string) => {
	const result = await prisma.complaint.findMany({
		where: {
			citizenId: citizenId
		},
		include: {
			staff: true,
			category: true
		}
	});
	return result
}
const getSingleComplaintFromDB = async (id: string) => {
	const result = await prisma.complaint.findUniqueOrThrow({
		where: {
			id: id
		},
		include: {
			staff: true,
			category: true,
			citizen: true
		}
	});
	return result
}

const updateComplaintFromDB = async (complaintId: string, citizenId: string, payload: ICreateComplaint) => {
	const result = await prisma.complaint.update({
		where: {
			id: complaintId,
			citizenId: citizenId,
			status: "PENDING"
		},
		data: payload
	});

	return result;
}


export const complaintService = {
	createComplain,
	getAllComplaintAdminFromDB,
	getAllComplaintMeFromDB,
	getSingleComplaintFromDB,
	updateComplaintFromDB
};
