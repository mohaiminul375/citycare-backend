import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { paymentService } from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createPaymentAndUpdateStatus = catchAsync(async (req: Request, res: Response) => {
    // const { complaintId } = req.body;
    // const citizenid = req.user?.id;
    const result = await paymentService.createPaymentAndUpdateStatusToDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "payment create successfully",
        data: result,
    });
})
const paymentCallBack = catchAsync(async (req: Request, res: Response) => {
    console.log(req.query,"req.query")
    const result = paymentService.paymentCallback();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "payment callback successfully",
        data: result,
    });
})

export const paymentController = {
    createPaymentAndUpdateStatus,
    paymentCallBack
}