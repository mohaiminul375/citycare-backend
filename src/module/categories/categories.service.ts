import { prisma } from "../../lib/prisma"

const createCategoryToDB = async (payload: { category: string }) => {
    const newCategory = await prisma.category.create({ data: payload })
    return newCategory
}

const getAllCategoryFromDB = async () => {
    const result = await prisma.category.findMany();
    return result
}


const deleteCategoryFromDB = async (id: string) => {
    const result = await prisma.category.delete({
        where: {
            id
        }
    })
    return result;
}
export const categoriesService = {
    createCategoryToDB,
    getAllCategoryFromDB,
    deleteCategoryFromDB
}