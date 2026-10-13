import type { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { categoriesService } from "./categories.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";


const createCategory = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await categoriesService.createCategoryToDB(payload)
    
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "create new category successfully",
        data: { result },
    });
})

export const categoriesController = {
    createCategory
}