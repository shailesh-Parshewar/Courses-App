import { ReactNode, Suspense } from "react";
import NavBar from "./Navbar";


export default function AdminLayout({
  children
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <NavBar />
      <Suspense>
        {children}
      </Suspense>
    </>
  )
}