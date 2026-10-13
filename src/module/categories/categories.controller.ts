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

const getAllCategory = catchAsync(async (req: Request, res: Response) => {
    const result = await categoriesService.getAllCategoryFromDB();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Get all category successfully",
        data: result,
    });
})


const deleteCategory = catchAsync(async (req: Request, res: Response) => {
    const id = req.params?.id
    await categoriesService.deleteCategoryFromDB(id as string)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "category delete successfully",
        data: null,
    });
})

export const categoriesController = {
    createCategory,
    deleteCategory,
    getAllCategory
}