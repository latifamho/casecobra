import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fromatPrice=(price:number)=>{
  const formater =new Intl.NumberFormat("en-US",{
    style:"currency",
    currency:"USD"
  })
  return formater.format(price)
}