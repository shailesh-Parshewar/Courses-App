import { Button } from "@/components/ui/button"
import Link from "next/link"


const PuchaseFailurePage = () => {
  return (
   <div className="conteiner my-6">
    <div className="flex flex-col items-start gap-4">
        <div className="text-3xl font-semibold">Purchase failed</div>
        <div className="text-3xl">There was a problem purchasing the product.</div>
        <Button asChild className="text-xl  h-auto py-6 px-8 rounded-lg">
          <Link href={"/"}>Try again</Link>
        </Button>
    </div>
   </div>
  )
}

export default PuchaseFailurePage