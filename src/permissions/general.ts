import { userRole } from "@/drizzle/schema";

export function canAccessAdminPages( role : userRole ) {
return role === "admin";
}