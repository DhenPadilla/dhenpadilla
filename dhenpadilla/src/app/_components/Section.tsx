import Link from "next/link"
import { ReactNode } from "react"

export const HomeSection = ({ title, children }: { title: string, children: ReactNode }) => {
    return ( 
        <div className="flex flex-col gap-6">
            <div className="flex text-sm/[1.25em] uppercase">{title}</div>
            {children}
        </div>
    )
}