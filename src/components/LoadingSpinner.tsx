import { cn } from "@/lib/utils"
import { Loader2Icon } from "lucide-react"
import { ComponentProps } from "react"


const LoadingSpinner = (
    {
        className,
        ...props }
        : {
            className?: string,
            props?: ComponentProps<typeof Loader2Icon>
        }) => {
    return (
        <Loader2Icon className={cn("animate-spin text-accent", className)} {...props} />
    )
}

export default LoadingSpinner