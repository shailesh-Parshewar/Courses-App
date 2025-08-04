
import { insertUser } from "@/features/users/db/users";
import { syncClerkUserMetadata } from "@/services/clerk";

import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const User = await currentUser();

  if (User == null) return new Response("User not found", { status: 500 })
  if (User.fullName == null) {
    return new Response("User name missing", { status: 500 })
  }
  if (User.primaryEmailAddress?.emailAddress == null) {
    return new Response("User email missing", { status: 500 })
  }

  const dbUser = await insertUser({
    clerkUserId: User.id,
    name: User.fullName,
    email: User.primaryEmailAddress.emailAddress,
    imageUrl: User.imageUrl,
    role: User.publicMetadata.role ?? "user",
  })

  await syncClerkUserMetadata(dbUser);


  return NextResponse.redirect(request.headers.get("referer") ?? "/")
}
