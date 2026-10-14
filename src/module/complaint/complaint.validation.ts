import z from "zod";

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

export const complaintValidationZod = {
	createComplainValidation,
};
