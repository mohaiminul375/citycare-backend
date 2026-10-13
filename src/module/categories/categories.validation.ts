import z from "zod";

const serviceCategories = z.object({
    category: z.string("Category Must be a string").uppercase('category must be uppercase electricity')
})

export const categoryValidationZod = {
    serviceCategories
}