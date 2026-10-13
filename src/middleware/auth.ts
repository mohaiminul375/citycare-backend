import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "../../generated/prisma/enums";
import { jwtUtils } from "../utils/jwt";
import config from "../config";
import type { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { catchAsync } from "../utils/catchAsync";

declare global {
	namespace Express {
		interface Request {
			user?: {
				id: string;
				name: string;
				email: string;
				role: UserRole;
			};
		}
	}
}
export const auth = (...requiredRoles: UserRole[]) => {
	return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const token = req.cookies.accessToken
			? req.cookies.accessToken
			: req.headers.authorization?.startsWith("Bearer ")
				? req.headers.authorization?.split(" ")[1]
				: req.headers.authorization;
		if (!token) {
			throw new Error("You are not login please login");
		}
		const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);

		if (!verifiedToken.success) {
			throw new Error(verifiedToken.error);
		}

		const { id, email, name, role } = verifiedToken.data as JwtPayload;
		if (requiredRoles.length && !requiredRoles.includes(role)) {
			throw new Error(
				"Forbidden: You don't have permission to access this resource",
			);
		}

		const user = await prisma.user.findUnique({
			where: { id, email },
		});

		if (!user) {
			throw new Error("user Not found");
		}
		if (user.status === "BLOCKED") {
			throw new Error("Your account has been blocked contact support");
		}

		req.user = {
			id,
			name,
			email,
			role,
		};
		next();
	});
};
