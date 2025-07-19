
import { db } from "@/drizzle/db";
import { userRole, UsersTable } from "@/drizzle/schema";
import { getUserIdTag } from "@/features/users/db/cache";


import { auth, clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import { cacheTag } from "next/dist/server/use-cache/cache-tag";


const client = await clerkClient()

export async function getCurrentUser({allData = false} = {}) {
    const { userId, sessionClaims, redirectToSignIn } = await auth();
    return {
        clerkUserId : userId,
        userId : sessionClaims?.dbId,
        role : sessionClaims?.role as userRole,

        user: allData && sessionClaims?.dbId ?
         await getUser(sessionClaims.dbId) : undefined,

       redirectToSignIn,
    }
}

export async function syncClerkUserMetadata(user : {
    id : string,
    clerkUserId : string,
    role: userRole
}) {
 return client.users.updateUserMetadata(user.clerkUserId, {
    publicMetadata : {
        dbId: user.id,
        role: user.role
    }
 })
}


async function getUser(id : string) {
    "use cache";
    cacheTag(getUserIdTag(id));
    console.log("called")
    return db.query.UsersTable.findFirst({where : eq(UsersTable.id, id)});
}