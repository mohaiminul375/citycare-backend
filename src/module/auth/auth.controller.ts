import { request, response, type Request, type Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthService } from "./auth.service";

const registerPatient = catchAsync(async (req: Request, res: Response) => {
	const payload = req.body;
	const result = await AuthService.registerPatient(payload);

	const { accessToken, refreshToken, user } = result;

	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		secure: false,
		sameSite: "none",
		maxAge: 1000 * 60 * 60 * 24, // 24 hour or 1 day
	});
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: false,
		sameSite: "none",
		maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
	});

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Patient registered successfully",
		data: {
			accessToken,
			refreshToken,
			user,
		},
	});
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
	const payload = req.body;
	const result = await AuthService.loginUser(payload);
	const { accessToken, refreshToken } = result;

	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		secure: false,
		sameSite: "none",
		maxAge: 1000 * 60 * 60 * 24, // 24 hour or 1 day
	});
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: false,
		sameSite: "none",
		maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
	});

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "User logged in successfully",
		data: {
			accessToken,
			refreshToken,
		},
	});
});

const getMe = catchAsync(async (req: Request, res: Response) => {
	console.log(req.user);
	const result = await AuthService.getMe(req.user?.id as string);
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "User data retrieved successfully",
		data: result,
	});
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
	if (!req.cookies.refreshToken) {
		throw new Error("Refresh token is missing");
	}
	const result = await AuthService.refreshToken(req.cookies.refreshToken);
	const { accessToken, refreshToken: newRefreshToken } = result;

	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		secure: false,
		sameSite: "none",
		maxAge: 1000 * 60 * 60 * 24, // 24 hour or 1 day
	});
	res.cookie("refreshToken", newRefreshToken, {
		httpOnly: true,
		secure: false,
		sameSite: "none",
		maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
	});

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "New tokens generated successfully",
		data: {
			accessToken,
			refreshToken: newRefreshToken,
		},
	});
});
// admin
const AllUser = catchAsync(async (req: Request, res: Response) => {
	const result = await AuthService.AllUserFromDB();
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "User list data retrieved successfully",
		data: result,
	});
})

const updateRole = catchAsync(async (req: Request, res: Response) => {
	const id = req.params.id;
	const updatedRole = req.body;
	const result = await AuthService.updateRoleFromDB(id as string, updatedRole)
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Role updated successfully",
		data: result,
	});
})
const blockUser = catchAsync(async (req: Request, res: Response) => {
	const id = req.params.id;
	const updatedStatus = req.body;
	const result = await AuthService.blockUserFromDB(id as string, updatedStatus)
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "user Blocked successfully",
		data: result,
	});
})

const googleLogin = (catchAsync(async (req: Request, res: Response) => {

	const payload = req.body;
	// console.log(req.body,"req body")
	const result = await AuthService.googleLogin(payload)
	const { accessToken, refreshToken } = result;

	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		secure: false,
		sameSite: "none",
		maxAge: 1000 * 60 * 60 * 24, // 24 hour or 1 day
	});
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: false,
		sameSite: "none",
		maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
	});

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "User logged in successfully",
		data: {
			accessToken,
			refreshToken,
		},
	});
}))
export const AuthController = {
	registerPatient,
	loginUser,
	getMe,
	refreshToken,
	AllUser,
	updateRole,
	blockUser,
	googleLogin
};
