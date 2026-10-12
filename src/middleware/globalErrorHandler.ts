import type { Response } from "express";
import httpStatus from "http-status";

export const globalErrorHandler = (err: Error, res: Response) => {
	res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
		success: false,
		message: err.message,
		error: err,
	});
};
