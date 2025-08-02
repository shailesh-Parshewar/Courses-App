import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export function getGlobalProductsTag() {
    return getGlobalTag("products")
}

export function getProductIdTag(id: string) {
    return getIdTag("products", id) 
}

export function revalidateProductCache(id: string) {
    revalidateTag(getGlobalProductsTag());
    revalidateTag(getProductIdTag(id));
}