import { env } from "@/data/env/server";
import { revalidateUserCache } from "@/features/users/db/cache";
import { deleteUser, insertUser, updateUser } from "@/features/users/db/users";
import { syncClerkUserMetadata } from "@/services/clerk";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";

export async function POST(req: Request) {

  // Get Svix headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing Svix headers", { status: 400 });
  }

  // Get raw body as string
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Verify webhook signature

  const wh = new Webhook(env.CLERK_WEBHOOK_SECRET);
  let event: WebhookEvent;
  try {
    event = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  // Handle events
  console.log("sdfdfjsdhfkjsdfshfsdfhljf");
  switch (event.type) {
    case "user.created":
    case "user.updated":
      {
      
        const email = event.data.email_addresses.find(email => email.id === event.data.primary_email_address_id)?.email_address;
        const name = `${event.data.first_name} ${event.data.last_name}`.trim();

        if (email == null) return new Response("No email", { status: 400 })
        if (name == "") return new Response("No name", { status: 400 })

        if (event.type == "user.created") {
         console.log("is this even executing")
          const user = await insertUser({
            clerkUserId: event.data.id,
            name,
            email,
            imageUrl: event.data.image_url,
            role: "user"
          })
          await syncClerkUserMetadata(user);
        } else {
        
          await updateUser({ clerkUserId: event.data.id }, {
            name,
            email,
            imageUrl: event.data.image_url,
            role: event.data.public_metadata.role
          })
        }

        break;
      }

    case "user.deleted":
      {
      
        if (event.data.id != null) {
          await deleteUser({ clerkUserId: event.data.id })
        }
        break;
      }

    default:
      console.log("bruh...")
      break;
  }

  return new Response("", { status: 200 });
}