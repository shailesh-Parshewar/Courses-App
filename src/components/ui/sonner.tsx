"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, toast, ToasterProps, ToastT } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export function ActionToast({
  actionData, ...props }: ToasterProps & { actionData: { error: boolean, message: string } }) {

  if (actionData.error) return toast.error(actionData.message, { ...props })
  else                  return toast.success(actionData.message, { ...props })
}

export { Toaster }
