"use server"
import { getCurrentUser } from "@/services/clerk";
import { canCreateProducts, canDeleteProducts, canUpdateProducts } from "../permissions/products";
import {
    deleteProduct as deleteProductDb,
    updateProduct as updateProductDB,
    insertProduct
} from "../db/product";
import { ProductSchema } from "../schema/product";
import { redirect } from "next/navigation";
import z from "zod";



export async function deleteProduct(id: string) {

    if (!canDeleteProducts(await getCurrentUser())) {
        return { error: true, message: "not authorised to delete products." }
    }

    await deleteProductDb(id);

    return { error: false, message: "successfully deleted the product." }
}

export async function createProduct(unsafeData: z.infer<typeof ProductSchema>) {
   const { success, data } = ProductSchema.safeParse(unsafeData)

  if (!success || !canCreateProducts(await getCurrentUser())) {
    return { error: true, message: "There was an error creating your product" }
  }
  console.log(data.courseIds)

  await insertProduct(data)
  return {error: true, message: "Successfully created your product."};
  
}
export async function updateProduct(id: string, unsafeData: z.infer<typeof ProductSchema>) {
    const { success, data } = ProductSchema.safeParse(unsafeData);

    if (!success) {
        return { error: true, message: "there was an error updating your product." }
    }
    else if (!canUpdateProducts(await getCurrentUser())) {
        return { error: true, message: "you are not authorised to update products." }
    }
    await updateProductDB(id, data);

    return { error: false, message: "Successfully updated the product." }

} 