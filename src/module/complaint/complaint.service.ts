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

export const complaintService = {
	createComplain,
	getAllComplaintAdminFromDB,
	getAllComplaintMeFromDB
};
