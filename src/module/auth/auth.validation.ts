import z from "zod";
import { UserRole, UserStatus } from "../../../generated/prisma/enums";

const userRegistrationZodSchema = z.object({
    name: z.string("name must be string"),
    email: z.email("Please provide a valid email"),
    password: z.string("password must be string").length(6, "password must be 6 character"),
})
const userLoginZodSchema = z.object({
    email: z.email("Please provide a valid email"),
    password: z.string("password must be string").length(6, "password must be 6 character"),
})

const roleValidationZodSchema = z.object({
    role: z.enum(UserRole)
})
const userStatusValidationZodSchema = z.object({
    status: z.enum(UserStatus)
})
export const userValidationZod = {
    userRegistrationZodSchema,
    userLoginZodSchema,
    roleValidationZodSchema,
    userStatusValidationZodSchema
}