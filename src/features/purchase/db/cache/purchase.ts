import { getGlobalTag, getIdTag, getUserTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export function getGlobalPurchaseTag() {
    return getGlobalTag("purchase")
}
export function getPurchaseUserTag(userId : string) {
    return getUserTag("purchase", userId)
}
export function getPurchaseIdTag(id: string) {
    return getIdTag("purchase", id) 
}

export function revalidatePurchaseCache( {id, userId} : {id: string, userId : string}) {
    console.log(id + "+----" +  userId)
    revalidateTag(getGlobalPurchaseTag());
    revalidateTag(getPurchaseUserTag(userId))
    revalidateTag(getPurchaseIdTag(id));
}