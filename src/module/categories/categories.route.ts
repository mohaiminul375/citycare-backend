import { Router } from "express";
import { categoriesController } from "./categories.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { validateRequestZod } from "../../middleware/validateRequestZod";
import { categoryValidationZod } from "./categories.validation";

const router = Router();











router.post('/',
    auth(UserRole.CITY_ADMIN, UserRole.ADMIN),
    validateRequestZod(categoryValidationZod.serviceCategories),
    categoriesController.createCategory)

router.get('/', categoriesController.getAllCategory)

router.delete('/:id', auth(UserRole.CITY_ADMIN, UserRole.ADMIN), categoriesController.deleteCategory)

export const categoriesRoutes = router;
