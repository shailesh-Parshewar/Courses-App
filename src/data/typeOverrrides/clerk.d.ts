import { userRole } from "@/drizzle/schema";

export {}

declare global {
    interface CustomJwtSessionClaims {
        dbId?: string,
        role?: userRole
    }
    interface UserPublicMetadata {
        dbId?: string,
        role?: userRole
    }
}