import { cn } from '@/lib/utils'
import { AsteriskIcon } from 'lucide-react'
import React, { ComponentPropsWithoutRef } from 'react'

const RequiredLabelIcon = ({className, ...props} : ComponentPropsWithoutRef<typeof AsteriskIcon>) => {
  return (
    <AsteriskIcon {...props} 
    className={cn("text-destructive inline size-4 align-top", className)} />
  )
}

export default RequiredLabelIcon