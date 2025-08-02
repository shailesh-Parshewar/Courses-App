
import { db } from "@/drizzle/db";
import { userRole, UsersTable } from "@/drizzle/schema";
import { getUserIdTag } from "@/features/users/db/cache";


import { auth, clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";


import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { redirect } from "next/navigation";


const client = await clerkClient()

export async function getCurrentUser({ allData = false } = {}) {
    await new Promise(res => setTimeout(res, 200));
    
    const { userId, sessionClaims, redirectToSignIn } = await auth();

    console.error("getCurrentUser method(after 200ms delay) :> " , userId, " : ", sessionClaims?.dbId);
    if (userId != null && sessionClaims?.dbId == null) {
        // this case will only happen if the user is not signed up and signs up directly at the purchase url 
        // since we call getCurrentUser we might end up calling it before clerk makes a POST request to our application making it so that clerk has the user but our database doesn't.
        
        redirect('/api/clerk/syncUsers');
    }
   
    return {
        clerkUserId: userId,
        userId: sessionClaims?.dbId,
        role: sessionClaims?.role as userRole,

        user: allData && sessionClaims?.dbId ?
            await getUser(sessionClaims.dbId) : undefined,

        redirectToSignIn,
    }
}

export async function syncClerkUserMetadata(user: {
    id: string,
    clerkUserId: string,
    role: userRole
}) {
    return client.users.updateUserMetadata(user.clerkUserId, {
        publicMetadata: {
            dbId: user.id,
            role: user.role
        }
    })
}


async function getUser(id: string) {
    "use cache";
    cacheTag(getUserIdTag(id));

    return db.query.UsersTable.findFirst({ where: eq(UsersTable.id, id) });
}