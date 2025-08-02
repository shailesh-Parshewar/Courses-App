import { ReactNode } from "react";
import NavBar from "./NavBar";

export default function ConsumerLayout({
    children
}: Readonly<{ children: ReactNode }>) {
    return (
  <>
  <NavBar />
 
  {children}
  
  </>
    )
}