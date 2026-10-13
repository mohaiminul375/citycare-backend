import { prisma } from "../../lib/prisma"

const createCategoryToDB = async (payload: { category: string }) => {
    const newCategory = await prisma.category.create({ data: payload })
    return newCategory
}

export const categoriesService = {
    createCategoryToDB
}