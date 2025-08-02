import { productStatuses } from "@/drizzle/schema";
import z from "zod";


export const ProductSchema = z.object({
    name : z.string().min(1, "Required"),
    description : z.string().min(1, "Required"),
    imageUrl : z.union([z.string().url("Invalid url"), z.string().startsWith("/", "Invalid Url")]),
    price  :z.number().int().nonnegative(),
status : z.enum(productStatuses),
courseIds : z.array(z.string()).min(1, "At least one course is required.")
})