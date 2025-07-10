import { Button } from "@/components/ui/button"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { Suspense } from "react"



const NavBar = () => {
    return (
        <header className="flex h-12 shadow bg-background z-10">
            <nav className="flex gap-4 container">
                <Link className="mr-auto text-lg hover:underline flex items-center px-2" href="/">Course Platform</Link>
                <Suspense>
                    <SignedIn>
                        <Link href="/admin" className="hover:bg-accent flex items-center px-2">Admin</Link>
                        <Link href="/courses" className="hover:bg-accent flex items-center px-2">My Courses</Link>
                        <Link href="/purchases" className="hover:bg-accent flex items-center px-2">Purchase History</Link>
                        <div className="size-8 self-center">
                            <UserButton appearance={{
                                elements: {
                                    userButtonAvatarBox: { width: "100%", height: "100%" }
                                }
                            }} />
                        </div>
                    </SignedIn>
                </Suspense>
                <Suspense>
                    <SignedOut>
                        <Button className="self-center" asChild>
                            <SignInButton />
                        </Button>
                    </SignedOut>
                </Suspense>
            </nav>
        </header>
    )
}

export default NavBar