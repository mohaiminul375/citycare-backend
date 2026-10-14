import { prisma } from "../../lib/prisma";
import type { ICreateComplaint } from "./complaint.interface";

const createComplain = async (payload: ICreateComplaint) => {
	const result = await prisma.complaint.create({ data: payload });
	return result;
};

export const complaintService = {
	createComplain,
};
