import { getCurrentUser } from "@/services/clerk";
import { redirect } from "next/navigation";


const AdminPage = async () => {
  const {role } = await getCurrentUser()
  if(role === "user") redirect("/")
  return (
    <div>TODO : build and fix</div>
  )
}

export default AdminPage