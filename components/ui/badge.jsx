import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-emerald-500 text-white shadow hover:bg-emerald-600",
        secondary:
          "border-transparent bg-slate-800 text-slate-200 hover:bg-slate-700",
        destructive:
          "border-transparent bg-rose-500 text-white hover:bg-rose-600",
        outline: "text-slate-200 border-slate-700",
        amber: "bg-amber-500/15 text-amber-300 border-amber-500/30",
        sky: "bg-sky-500/15 text-sky-300 border-sky-500/30",
        emerald: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
