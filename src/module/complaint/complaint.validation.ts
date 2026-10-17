import z from "zod";
import { staffAssignmentStatus } from "../../../generated/prisma/enums";

const createComplainValidation = z.object({
	title: z.string("title must be a string"),
	description: z
		.string("description must be a string")
		.min(10, "description length must be at least 10"),
	address: z
		.string("address Must be a string")
		.min(5, "address length must be at least 10"),
	citizenId: z.string("citizen id must be a string"),
	categoryId: z.string("category id must be a sting"),
});
const staffAssignmentSchema = z.object({
	status: z.enum(staffAssignmentStatus),
});
export const complaintValidationZod = {
	createComplainValidation,
	staffAssignmentSchema,
};
