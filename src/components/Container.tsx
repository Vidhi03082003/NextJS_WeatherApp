import { cn } from '@/utils/cn'
import React from 'react'



export default function Container(props:React.HTMLProps<HTMLDivElement>) {
  return (
    <div 
    {...props}
    className={cn('w-full bg-black/70 border rounded-xl flex py-4 shadow-sm text-white',props.className)}
    />
  )
}