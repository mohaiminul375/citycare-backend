import bcrypt from "bcryptjs";
import type { JwtPayload, SignOptions } from "jsonwebtoken";
import {
	AuthProvider,
	UserRole,
	UserStatus,
} from "../../../generated/prisma/enums";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { jwtUtils } from "../../utils/jwt";
import type {
	IGoogleLoginPayload,
	ILoginUserPayload,
	IRegisterPatientPayload,
} from "./auth.interface";
import type { TokenPayload } from "google-auth-library";
import { googleClient } from "../../lib/googleAuth";

const registerUserToDB = async (payload: IRegisterPatientPayload) => {
	const { name, password } = payload;
	const email = payload.email.trim().toLowerCase();

	const isUserExists = await prisma.user.findUnique({
		where: { email },
	});

	if (isUserExists) {
		throw new Error("User with this email already exists");
	}

	const hashedPassword = await bcrypt.hash(
		password,
		Number(config.bcrypt_salt_rounds),
	);

	const createdUser = await prisma.user.create({
		data: {
			name,
			email,
			password: hashedPassword,
			role: UserRole.CITIZEN,
			status: UserStatus.ACTIVE,
			emailVerified: false,
			profile: {
				create: { name, email },
			},
		},
		omit: { password: true },
	});

	const { ...user } = createdUser;
	const jwtPayload = {
		userId: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
	};

	const accessToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_access_secret,
		config.jwt_access_expires_in as SignOptions,
	);

	const refreshToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_refresh_secret,
		config.jwt_refresh_expires_in as SignOptions,
	);

	return {
		user,
		accessToken,
		refreshToken,
	};
};

const loginUserToDB = async (payload: ILoginUserPayload) => {
	const { password } = payload;
	const email = payload.email.trim().toLowerCase();

	const user = await prisma.user.findUnique({
		where: { email },
	});

	if (!user) {
		throw new Error("User not found");
	}

	if (user.status === UserStatus.BLOCKED) {
		throw new Error("User is blocked");
	}
	if (user.password === null && user.googleId !== null) {
		throw new Error(
			"User already has account with google try to login with google",
		);
	}
	const isPasswordMatched = await bcrypt.compare(
		password,
		user.password as string,
	);

	if (!isPasswordMatched) {
		throw new Error("Invalid credentials");
	}

	const jwtPayload = {
		id: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
	};

	const accessToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_access_secret,
		config.jwt_access_expires_in as SignOptions,
	);

	const refreshToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_refresh_secret,
		config.jwt_refresh_expires_in as SignOptions,
	);

	return {
		accessToken,
		refreshToken,
	};
};

const getMeFromDB = async (id: string) => {
	const profile = await prisma.user.findUniqueOrThrow({
		where: { id },
		omit: {
			password: true,
		},
		include: {
			profile: true,
		},
	});
	return profile;
};

const refreshToken = async (token: string) => {
	const verifiedRefreshToken = jwtUtils.verifyToken(
		token,
		config.jwt_refresh_secret,
	);

	if (!verifiedRefreshToken.success || !verifiedRefreshToken.data) {
		throw new Error(
			config.node_env === "development"
				? verifiedRefreshToken.error
				: "Invalid refresh token",
		);
	}

	const data = verifiedRefreshToken.data as JwtPayload;

	const user = await prisma.user.findUnique({
		where: { id: data.userId },
	});

	if (!user || user.status !== UserStatus.ACTIVE) {
		throw new Error("User is inactive or not found");
	}

	const jwtPayload = {
		userId: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
	};

	const accessToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_access_secret,
		config.jwt_access_expires_in as SignOptions,
	);

	const refreshToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_refresh_secret,
		config.jwt_refresh_expires_in as SignOptions,
	);

	return {
		accessToken,
		refreshToken,
	};
};
// admin
const AllUserFromDB = async () => {
	const users = await prisma.user.findMany({
		omit: {
			password: true,
		},
	});
	return users;
};
const updateRoleFromDB = async (id: string, updateRole: { role: string }) => {
	const user = await prisma.user.update({
		where: { id },
		data: {
			role: updateRole.role as UserRole,
		},
	});
	return user;
};
const blockUserFromDB = async (
	id: string,
	updateStatus: { status: string },
) => {
	const user = await prisma.user.update({
		where: { id },
		data: {
			status: updateStatus.status as UserStatus,
		},
	});
	return user;
};

const googleLogin = async (payload: IGoogleLoginPayload) => {
	// const result = googleClient.verifyIdToken({
	// 	idToken: payload.idToken
	// })

	// const googleInfo = (await result).getPayload()

	// googleInfo.
	console.log(payload);
	let googleIdTokenPayload: TokenPayload | null | undefined = null;
	try {
		const ticket = await googleClient.verifyIdToken({
			idToken: payload.idToken,
			audience: config.google_client_id,
		});

		googleIdTokenPayload = ticket.getPayload();
	} catch (error) {
		console.log("Google id token verify failed!", error);
		throw new Error("Invalid or expired google id token");
	}

	if (!googleIdTokenPayload) {
		throw new Error("Invalid or expired google id token");
	}

	if (!googleIdTokenPayload.email) {
		throw new Error("google email not found");
	}
	if (!googleIdTokenPayload.name) {
		throw new Error("google name not found");
	}
	const isUserExistedWithGoogleAuth = await prisma.user.findUnique({
		where: {
			email: googleIdTokenPayload.email,
			googleId: googleIdTokenPayload.sub,
		},
	});
	let user = isUserExistedWithGoogleAuth;
	if (!isUserExistedWithGoogleAuth) {
		// find in credential
		const isUserExistedWithCredential = await prisma.user.findUnique({
			where: {
				email: googleIdTokenPayload.email,
				authProvider: AuthProvider.CREDENTIAL,
			},
		});

		if (isUserExistedWithCredential) {
			if (isUserExistedWithCredential.status === UserStatus.BLOCKED) {
				throw new Error("User is Blocked");
			}
			user = await prisma.user.update({
				where: {
					id: isUserExistedWithCredential.id,
				},
				data: {
					googleId: googleIdTokenPayload.sub,
				},
			});
		} else {
			// google register
			user = await prisma.user.create({
				data: {
					name: googleIdTokenPayload.name,
					email: googleIdTokenPayload.email,
					googleId: googleIdTokenPayload.sub,
					role: UserRole.CITIZEN,
					authProvider: AuthProvider.GOOGLE,
					emailVerified: true,
					profile: {
						create: {
							name: googleIdTokenPayload.name,
							email: googleIdTokenPayload.email,
						},
					},
				},
			});
		}
	}
	if (!user) {
		throw new Error("User Not Found");
	}
	if (user.status === UserStatus.BLOCKED) {
		throw new Error("User is Blocked");
	}
	const jwtPayload = {
		id: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
	};

	const accessToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_access_secret,
		config.jwt_access_expires_in as SignOptions,
	);

	const refreshToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_refresh_secret,
		config.jwt_refresh_expires_in as SignOptions,
	);

	return {
		accessToken,
		refreshToken,
	};
};
export const AuthService = {
	registerUserToDB,
	loginUserToDB,
	getMeFromDB,
	refreshToken,
	AllUserFromDB,
	updateRoleFromDB,
	blockUserFromDB,
	googleLogin,
};
